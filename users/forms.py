from django import forms


class RegisterUserForm(forms.Form):
    name = forms.CharField(label='用户名')
    email = forms.EmailField(label='邮箱')
    password = forms.CharField(label='密码', widget=forms.PasswordInput)
    re_password = forms.CharField(label='确认密码', widget=forms.PasswordInput)

