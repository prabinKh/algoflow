from django.contrib import admin

# Register your models here.
from .models import *
from django.contrib.auth.admin import UserAdmin

class UserModelAdmin(UserAdmin):


    list_display = ('email', 'name', 'tc', 'is_admin')
    list_filter = ('is_admin', 'name',)
    fieldsets = (
        ('User Credentials',{
            'fields':('email', 'password'),
        }),
        ('Permissions',{'fields':('is_admin',)}),
        ('Personal info',{'fields':('name', 'tc')}),

    )

    add_fieldsets =(
        ('User Credentials',{
            'fields':('email', 'name','password1', 'password2'),
        }),
    )

    search_fields = ('email', 'name',)
    ordering = ('name','id','created_at')
    filter_horizontal = ()


admin.site.register(MyUser, UserModelAdmin)




