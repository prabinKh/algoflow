from django.db import models

# Create your models here.
from django.contrib.auth.models import User,BaseUserManager,AbstractBaseUser

class MyUserManager(BaseUserManager):
    def create_user(self,email,name,tc,password=None,password2=None):
        if not email:
            raise ValueError ('User must have an email address')
        user = self.model(
            email = self.normalize_email(email),
            name = name,
            tc = tc,

        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,email,name , tc, password=None):
        user = self.create_user(
            email,
            name=name,
            tc=tc,
            password=password,
        )
        user.is_admin = True
        user.save(using = self._db)
        return user

class MyUser(AbstractBaseUser):
    email = models.EmailField(unique=True,verbose_name='email address',max_length=255)

    name = models.CharField(max_length=100)
    tc = models.BooleanField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name','tc']

    def __str__(self):
        return self.email

    def has_perm(self,perm):
        return self.is_admin

    
    def has_module_perms(self,app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

