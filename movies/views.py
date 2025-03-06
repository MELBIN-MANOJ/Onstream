from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from .models import PasswordResetToken
import uuid
from datetime import datetime, timedelta

#Chatbot configuration
from django.shortcuts import render
import requests
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Email configuration
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

# Existing functions
def index(request):
    return render(request, 'movies/index.html')

def moviedetail(request):
    return render(request, 'movies/moviedetail.html')

def login_page(request):
    return render(request, 'movies/login.html')

def register_page(request):
    return render(request, 'movies/register.html')

# New page render functions
def forgot_password_page(request):
    return render(request, 'movies/forgot-password.html')

def reset_password_page(request):
    return render(request, 'movies/reset-password.html')

@api_view(['POST'])
def login_api(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def register_api(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()
        
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'email': user.email
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def password_reset_request(request):
    try:
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists with this email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal that the user doesn't exist for security
            return Response({'message': 'If your email is registered, you will receive a password reset link shortly.'})
        
        # Create password reset token
        reset_token = PasswordResetToken.objects.create(user=user)
        
        # Build the reset URL
        reset_url = f"{request.scheme}://{request.get_host()}/reset-password.html?token={reset_token.token}"
        
        # Email content
        context = {
            'reset_url': reset_url,
            'user': user,
            'token': reset_token.token,
            'expiry_hours': 24,
        }
        
        html_message = render_to_string('emails/password_reset_email.html', context)
        plain_message = strip_tags(html_message)
        
        try:
            # Send email with more detailed error handling
            send_mail(
                subject='OnStream - Password Reset',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False
            )
            print(f"Password reset email sent to {email}")  # Add print for logging
        except Exception as email_error:
            print(f"Failed to send email: {email_error}")  # Detailed error logging
            return Response({'error': 'Failed to send password reset email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'message': 'If your email is registered, you will receive a password reset link shortly.'})
    
    except Exception as e:
        print(f"Password reset request error: {e}")  # Additional error logging
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def password_reset_confirm(request):
    try:
        token_str = request.data.get('token')
        password = request.data.get('password')
        
        if not token_str or not password:
            return Response({'error': 'Token and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate password
        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the token
        try:
            reset_token = PasswordResetToken.objects.get(token=token_str)
        except PasswordResetToken.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if token is valid
        if not reset_token.is_valid():
            return Response({'error': 'Token has expired or already been used'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Reset the password
        user = reset_token.user
        user.set_password(password)
        user.save()
        
        # Mark token as used
        reset_token.is_used = True
        reset_token.save()
        
        return Response({'message': 'Password has been reset successfully'})
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


def chatbot_page(request):
    return render(request, 'movies/chatbot.html')

@csrf_exempt
def chatbot_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = data.get('message', '')
            
            # Groq API configuration
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "llama3-8b-8192",  # You can change this to other available models
                "messages": [
                    {
                        "role": "system", 
                        "content": "You are a helpful movie and TV show assistant. Provide recommendations, answer questions about movies and TV shows, discuss film and television trivia, and help users find content they might enjoy."
                    },
                    {
                        "role": "user", 
                        "content": message
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 300
            }
            
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                # Extract the AI's response
                ai_message = result['choices'][0]['message']['content']
                return JsonResponse({'message': ai_message})
            else:
                return JsonResponse({'error': 'Failed to get response from Groq API'}, status=400)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def edit_profile_page(request):
    return render(request, 'movies/edit-profile.html')

@api_view(['POST'])
def update_profile(request):
    try:
        user = request.user
        username = request.data.get('username')
        email = request.data.get('email')
        profile_pic = request.FILES.get('profile_pic')

        if username:
            user.username = username
        if email:
            user.email = email

        user.save()

        # Profile picture handling would require a separate UserProfile model
        if profile_pic:
            # Save profile picture logic here
            pass

        return Response({
            'message': 'Profile updated successfully',
            'username': user.username,
            'email': user.email
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def favourites_page(request):
    return render(request, 'movies/favourites.html')


    # Add these imports at the top if not already present
from django.shortcuts import render
from django.http import JsonResponse
import requests
from django.conf import settings

def castdetail_page(request):
    """
    Render the cast detail page
    """
    return render(request, 'movies/castdetail.html')

@api_view(['GET'])
def get_person_details(request, person_id):
    """
    Fetch person details from TMDB API
    """
    try:
        # TMDB API configuration
        api_key = settings.TMDB_API_KEY
        base_url = "https://api.themoviedb.org/3"
        
        # Fetch person details
        person_url = f"{base_url}/person/{person_id}?api_key={api_key}&append_to_response=combined_credits,images"
        response = requests.get(person_url)
        
        if response.status_code == 200:
            person_data = response.json()
            
            # Process and structure the data
            formatted_data = {
                'id': person_data.get('id'),
                'name': person_data.get('name'),
                'biography': person_data.get('biography'),
                'birthday': person_data.get('birthday'),
                'place_of_birth': person_data.get('place_of_birth'),
                'profile_path': person_data.get('profile_path'),
                'known_for_department': person_data.get('known_for_department'),
                'popularity': person_data.get('popularity'),
                
                # Process credits
                'movie_credits': [],
                'tv_credits': []
            }
            
            # Process combined credits
            if 'combined_credits' in person_data:
                for credit in person_data['combined_credits'].get('cast', []):
                    credit_info = {
                        'id': credit.get('id'),
                        'title': credit.get('title') or credit.get('name'),
                        'release_date': credit.get('release_date') or credit.get('first_air_date'),
                        'poster_path': credit.get('poster_path'),
                        'character': credit.get('character'),
                        'media_type': credit.get('media_type')
                    }
                    
                    if credit.get('media_type') == 'movie':
                        formatted_data['movie_credits'].append(credit_info)
                    else:
                        formatted_data['tv_credits'].append(credit_info)
            
            # Sort credits by release date
            formatted_data['movie_credits'].sort(
                key=lambda x: x['release_date'] if x['release_date'] else '0000-00-00',
                reverse=True
            )
            formatted_data['tv_credits'].sort(
                key=lambda x: x['release_date'] if x['release_date'] else '0000-00-00',
                reverse=True
            )
            
            return Response(formatted_data)
        else:
            return Response(
                {'error': 'Failed to fetch person details'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_person_images(request, person_id):
    """
    Fetch person images from TMDB API
    """
    try:
        api_key = settings.TMDB_API_KEY
        base_url = "https://api.themoviedb.org/3"
        
        # Fetch person images
        images_url = f"{base_url}/person/{person_id}/images?api_key={api_key}"
        response = requests.get(images_url)
        
        if response.status_code == 200:
            images_data = response.json()
            return Response(images_data)
        else:
            return Response(
                {'error': 'Failed to fetch person images'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def search_person(request):
    """
    Search for people using TMDB API
    """
    try:
        query = request.GET.get('query', '')
        if not query:
            return Response(
                {'error': 'Search query is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        api_key = settings.TMDB_API_KEY
        base_url = "https://api.themoviedb.org/3"
        
        # Search for people
        search_url = f"{base_url}/search/person?api_key={api_key}&query={query}"
        response = requests.get(search_url)
        
        if response.status_code == 200:
            search_data = response.json()
            return Response(search_data)
        else:
            return Response(
                {'error': 'Failed to search for person'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )