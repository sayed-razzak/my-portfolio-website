import json
import os
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from .models import ContactMessage, Resume


def portfolio_data(request):
    data = {
        "name": "Sayed Abdul Rajjak",
        "role": "AI Enthusiast | Full Stack Developer",
        "tagline": "Building modern web applications and intelligent solutions using React, Django, and Machine Learning.",
        "open_to_work": True,

        "about": "I am a final-year Computer Science student passionate about full-stack development, clean UI design, and solving real-world problems through technology. I enjoy building responsive and scalable web applications using React and Django. Alongside web development, I am actively exploring machine learning and its applications across different domains.",

        "tech_stack": [
            {
                "category": "Frontend",
                "items": ["React", "JavaScript", "HTML", "CSS"]
            },
            {
                "category": "Backend",
                "items": ["Django", "Python", "REST API"]
            },
            {
                "category": "Machine Learning",
                "items": ["Machine Learning", "Image Processing"]
            },
            {
                "category": "Tools",
                "items": ["Git", "GitHub", "VS Code"]
            }
        ],

        "featured_projects": [
            {
                "title": "Fake Medicine Detection System",
                "description": "Developed a machine learning-based system to detect fake medicine products using image processing techniques, improving safety and reliability.",
                "tech": "Python, Machine Learning, Image Processing",
                "link": "https://github.com/sayed-razzak/fake-medicine-detection"
            },
            {
                "title": "Social Media Marketing Agency Website",
                "description": "Built a modern and responsive full-stack website for a social media marketing agency with clean UI and dynamic features.",
                "tech": "React, Django, JavaScript, CSS",
                "link": "https://postyourbrandd.netlify.app/"
            }
        ],

        "projects": [
            {
                "title": "Portfolio Website",
                "description": "Designed and developed a full-stack personal portfolio with dark mode, resume download feature, and backend-powered contact system.",
                "tech": "React, Django, CSS",
                "link": "#"
            },
            {
                "title": "Fake Medicine Detection System",
                "description": "A machine learning project focused on detecting fake medicines using image processing and classification techniques.",
                "tech": "Python, Machine Learning, Image Processing",
                "link": "https://github.com/sayed-razzak/fake-medicine-detection"
            },
            {
                "title": "Social Media Marketing Agency Website",
                "description": "A modern full-stack website built for a marketing agency with responsive UI and user-friendly design.",
                "tech": "React, Django, JavaScript, CSS",
                "link": "https://postyourbrandd.netlify.app/"
            }
        ],

        "socials": {
            "github": "https://github.com/sayed-razzak",
            "linkedin": "https://www.linkedin.com/in/sayed-abdul-rajjak-745875176/",
            "instagram": "https://www.instagram.com/heyy_badsha/"
        }
    }

    return JsonResponse(data)

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ContactMessage

@csrf_exempt
def contact_submit(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        if not name or not email or not message:
            return JsonResponse({"error": "All fields are required"}, status=400)

        ContactMessage.objects.create(
            name=name,
            email=email,
            message=message
        )

        return JsonResponse({"message": "Message sent successfully"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    
def resume_meta(request):
    resume = Resume.objects.order_by('-uploaded_at').first()

    if not resume:
        return JsonResponse({"available": False})

    return JsonResponse({
        "available": True,
        "title": resume.title,
        "uploaded_at": resume.uploaded_at.strftime("%d %b %Y"),
        "download_count": resume.download_count
    })


from django.http import FileResponse
import os

def resume_download(request):
    resume = Resume.objects.order_by('-uploaded_at').first()

    if not resume:
        return JsonResponse({"error": "No resume found"}, status=404)

    file_path = resume.file.path

    if not os.path.exists(file_path):
        return JsonResponse({"error": "File not found"}, status=404)

    response = FileResponse(open(file_path, 'rb'))
    response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
    response['Cache-Control'] = 'no-store'   # 🔥 IMPORTANT LINE

    return response

@csrf_exempt
def contact_submit(request):
    print("REQUEST HIT")   # 👈 ADD THIS
