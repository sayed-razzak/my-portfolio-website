from django.urls import path
from .views import portfolio_data, contact_submit, resume_meta, resume_download

urlpatterns = [
    path('portfolio/', portfolio_data),
    path('contact/', contact_submit),
    path('resume/', resume_meta),
    path('resume/download/', resume_download),
]