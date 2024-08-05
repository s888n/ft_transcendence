import os
import magic
from django.core.exceptions import ValidationError
from django.contrib.auth import password_validation
from django import forms
from django.contrib import auth

def validate_is_image(file):
    print("validating")
    valid_mime_types = ['image/png', 'image/jpeg']
    file_mime_type = magic.from_buffer(file.read(1024), mime=True)
    if file_mime_type not in valid_mime_types:
        raise ValidationError('Unsupported file type.')
    valid_file_extensions = ['.png', '.jpeg', '.jpg']
    ext = os.path.splitext(file.name)[1]
    print("exxxt", ext)
    if ext.lower() not in valid_file_extensions:
        raise ValidationError('Unacceptable file extension.')
    max_file_size = 2 * 1024 * 1024  # 2 MB in bytes
    if file.size > max_file_size:
        raise ValidationError('File size exceeds the maximum allowed size (2MB)')
    print("valide")
    
    

def is_strong_assword(password):

        # At least MIN_LENGTH long
        if len(password) < 8:
            return False
        
        return True