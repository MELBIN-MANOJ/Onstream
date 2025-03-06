from django.urls import path
from .views import *

urlpatterns = [
    path('index.html', index, name='index'),
    path('moviedetail.html', moviedetail, name='moviedetail'), 

    # Page URLs
    path('', login_page, name='login_page'),
    path('login.html', login_page, name='login_page'),
    path('register.html', register_page, name='register_page'),
    path('forgot-password.html', forgot_password_page, name='forgot_password_page'),
    path('reset-password.html', reset_password_page, name='reset_password_page'),
    path('edit-profile/', edit_profile_page, name='edit_profile_page'),
    path('api/update-profile/', update_profile, name='update_profile'),
    path('favourites/', favourites_page, name='favourites_page'),
    
    # API URLs
    path('api/login/', login_api, name='login_api'),
    path('api/register/', register_api, name='register_api'),
    path('api/password-reset-request/', password_reset_request, name='password_reset_request'),
    path('api/password-reset-confirm/', password_reset_confirm, name='password_reset_confirm'),

    path('chatbot.html', chatbot_page, name='chatbot_page'),
    path('api/chatbot/', chatbot_api, name='chatbot_api'),

        path('castdetail.html', castdetail_page, name='castdetail_page'),
    path('api/person/<int:person_id>/', get_person_details, name='get_person_details'),
    path('api/person/<int:person_id>/images/', get_person_images, name='get_person_images'),
    path('api/person/search/', search_person, name='search_person'),
]
