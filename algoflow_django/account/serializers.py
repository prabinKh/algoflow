from rest_framework import serializers
import uuid
from account.models import *
from django.utils.encoding import smart_str, force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from account.utils import Util
class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'},write_only = True)
    class Meta:
        model = MyUser
        fields = ('email','name','tc','password','password2')
        extra_kwargs = {
            'password':{
                "write_only": True

            }
        }
    
    def validate (self,data):
        password = data.get('password')
        password2 = data.get('password2')
        if password != password2:
            raise serializers.ValidationError('Password and confirem password does not match')
        return data

    def create(self, validated_data):
        return MyUser.objects.create_user(**validated_data)

      
class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    class Meta:
        model  = MyUser
        fields = ('email','password')
        


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ('id','email','name')

class UserChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=100, write_only=True)
    password2 = serializers.CharField(max_length=100, write_only=True)
    class Meta:
        model = MyUser
        fields = ('password', 'password2')
    def validate(self,data):
        password = data.get('password')
        password2 = data.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("Password and confirm password does not match")
        user.set_password(password)
        user.save()

        return data

class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    class Meta:
        fields = ('email',)
    def validate(self,data):
        email = data.get('email')
        if MyUser.objects.filter(email=email).exists():
            user = MyUser.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            link = 'http://localhost:8000/api/user/resetpassword/'+uid+'/'+token
            
            # Improved email content
            email_body = f'''
Hello {user.name},

You have requested to reset your password. Click the link below to reset your password:

{link}

If you did not request this, please ignore this email.

Thank you,
The Team
            '''
            
            Util.send_email({
                'subject': 'Password Reset Request',
                'body': email_body.strip(),
                'to_email': user.email
            })
            return data
        
        else:
            raise serializers.ValidationError('You are not a registered user')


class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=100, write_only=True)
    password2 = serializers.CharField(max_length=100, write_only=True)
    class Meta:
        fields = ('password', 'password2')
    def validate(self,data):
        try:
            password = data.get('password')
            password2 = data.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            
            if password != password2:
                raise serializers.ValidationError("Password and confirm password does not match")
                
            id = force_str(urlsafe_base64_decode(uid))
            user = MyUser.objects.get(id=id)
            
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError("Token is not valid or expired")
                
            user.set_password(password)
            user.save()
            return data
            
        except ValidationError as e:
            raise serializers.ValidationError("Token is not valid or expired")
        except MyUser.DoesNotExist:
            raise serializers.ValidationError("User not found")
        except UnicodeDecodeError:
            raise serializers.ValidationError("Token is not valid or expired")
        except Exception as e:
            raise serializers.ValidationError("Token is not valid or expired")
