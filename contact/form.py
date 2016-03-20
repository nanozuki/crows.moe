from django import forms
from captcha.fields import CaptchaField


class PostMessageForm(forms.Form):
    name = forms.CharField(label='name', max_length=10, required=False,
                           widget=forms.TextInput(attrs={
                               'class': 'form-control',
                               'placeholder': '(可选)留下你的昵称吧'}))
    email = forms.EmailField(label='email', max_length=40, required=False,
                             widget=forms.EmailInput(attrs={
                                 'class': 'form-control',
                                 'placeholder': '(可选)您的邮箱不会公开'}))
    content = forms.CharField(label='评论', max_length=300,
                              widget=forms.Textarea(attrs={
                                  'class': 'form-control',
                                  'placeholder':
                                      '说点什么吧(点击楼层号或ID可回复，支持markdown格式)',
                                  'rows': '5', 'required': True,
                                  'style': 'resize: none',
                                  'data-provide': 'markdown'}))
    captcha = CaptchaField(label='验证码', required=True, error_messages={
        'required': '请填写验证码', 'invalid': '验证码错误!'})
