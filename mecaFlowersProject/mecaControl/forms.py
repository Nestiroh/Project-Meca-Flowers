from django import forms

class LoginForm(forms.Form):
    email = forms.EmailField()
    contrasena = forms.CharField(widget=forms.PasswordInput)

