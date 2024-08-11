from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager
from .validators import validate_is_image
from django.core.exceptions import ObjectDoesNotExist


class CustomUserManager(BaseUserManager):
    def _create_user(self, email, password, username, **extra_fields):
        if not email:
            raise ValueError("Email must be provided")
        if not password:
            raise ValueError('Password is not provided')

        user = self.model(
            email = self.normalize_email(email),
            username = username,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, username, **extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_active',True)
        extra_fields.setdefault('is_superuser',False)
        return self._create_user(email, password, username, password, **extra_fields)

    def create_superuser(self, email, password, username, **extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_active',True)
        extra_fields.setdefault('is_superuser',True)
        return self._create_user(email, password, username, **extra_fields)

                
class Avatar(models.Model):
    file = models.FileField(upload_to='images/', validators=(validate_is_image,))
    uploaded_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.uploaded_on.date()

# Create your User Model here.
class User(AbstractBaseUser,PermissionsMixin):
    # Abstractbaseuser has password, last_login, is_active by default

    email = models.EmailField(db_index=True, unique=True, max_length=254)
    username = models.CharField(max_length=10, unique=True)
    nickname = models.CharField(max_length=10, blank=True)
    elo = models.IntegerField(default=1000)
    games_won = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)
    avatar = models.CharField(max_length=255, default="default.png")
    is_online = models.BooleanField(default=False)
    is_from_42 = models.BooleanField(default=False)
    first_username = models.CharField(max_length=255, blank=True)
    first_email = models.EmailField(max_length=255, blank=True)

    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        
       
       
class FriendsList(models.Model):
    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user")
    friends     = models.ManyToManyField(User, blank=True, related_name="friends")
    
    def add_friend(self, to_add):
        
        if to_add not in self.friends.all():
            self.friends.add(to_add)
            self.save()
            
    def remove_friend(self, to_remove):
        if to_remove in self.friends.all():
            self.friends.remove(to_remove)
            self.save()
            
    def unfriend(self, to_unfriend):
        self.remove_friend(to_unfriend)
        """
        Error my be in here
        """
        to_unfriend.remove_friend(self.user)
        
    def are_friends(self, to_check):
        if to_check in self.friends.all():
            return True
        return False
    
    def __str__(self):
        return self.user.username
    

class BlockedList(models.Model):
    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name="blocker_user")
    blocked_list     = models.ManyToManyField(User, blank=True, related_name="blocked_users")
    
    def block_user(self, to_block):
        if to_block not in self.blocked_list.all():
            friends_list, _ = FriendsList.objects.get_or_create(user=self.user)
            try:
                friend_request = FriendRequest.objects.get(sender=to_block, receiver=self.user)
                friend_request.reject()
            except ObjectDoesNotExist:
                pass
            try:
                friend_request = FriendRequest.objects.get(sender=self.user, receiver=to_block)
                friend_request.cancel()
            except ObjectDoesNotExist:
                pass
            friends_list.remove_friend(to_block)
            friends_list, _ = FriendsList.objects.get_or_create(user=to_block)
            friends_list.remove_friend(self.user)
            self.blocked_list.add(to_block)
            self.save()

    def deblock_user(self, to_deblock):
        if to_deblock in self.blocked_list.all():
            self.blocked_list.remove(to_deblock)
            self.save()
            
    def check_if_blocked(self, to_check):
        return to_check in self.blocked_list.all()


class FriendBlock(models.Model):
    blocker     = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blocker")
    blocked     = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blocked")
    
    def block_user(self, to_block):
        blocked_list = BlockedList.objects.get_or_create(user=self.blocker)
        blocked_list.block_user(to_block)

    def deblock_user(self, to_deblock):
        blocked_list = BlockedList.objects.get_or_create(user=self.blocker)
        blocked_list.deblock_user(to_deblock)
        self.delete()

    

class FriendRequest(models.Model):
    sender      = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver    = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")
    is_active   = models.BooleanField(default=True)
    
    def accept(self):
        senders_friends, _ = FriendsList.objects.get_or_create(user=self.sender)
        receivers_friends, _ = FriendsList.objects.get_or_create(user=self.receiver)
        if senders_friends and receivers_friends:
            senders_friends.add_friend(self.receiver)
            receivers_friends.add_friend(self.sender)
            self.is_active = False
            self.save()
            
    def reject(self):
        self.is_active = False
        self.save()
        
    def cancel(self):
        self.is_active = False
        self.save()

        
class MatchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='match_history')
    opponent = models.CharField(max_length=255)  # Name or identifier of the opponent
    date_played = models.DateField()
    result = models.CharField(max_length=20)  # Win, loss, draw, etc. You can use choices field if needed
    details = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-date_played']