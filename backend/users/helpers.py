
import random
import string
from .models import User
import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
import requests

def generate_random_username(length=10, intarUsername=''):
    """
    Generate a random username that is not already in the User model.
    """
    if not User.objects.filter(username=intarUsername).exists():
            return intarUsername
    while True:
        # Generate a random username
        username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
        
        # Check if the username is already in use
        if not User.objects.filter(username=username).exists():
            return username


def generate_random_email(domain="randomemail.com", intraEmail=""):
    if not User.objects.filter(email=intraEmail).exists():
        return intraEmail
    while True:
        # Generate a random username
        letters = ''.join(random.choice(string.ascii_letters) for _ in range(7))

        # Combine username and domain
        email = letters + "@" + domain
        if not User.objects.filter(email=email).exists():
            return email
        
def generate_random_avatar_name(length=10, file_extension=''):
    """
    Generate a random email that is not already in the User model.
    """
    while True:
        # Generate a random email
        avatar = ''.join(random.choices(string.digits, k=length))
        
        # Check if the avatar is already in use
        if not User.objects.filter(avatar=avatar+file_extension).exists():
            return avatar
