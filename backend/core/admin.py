from django.contrib import admin
from .models import ContactMessage, Resume

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email')
    readonly_fields = ('created_at',)

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'download_count', 'uploaded_at')
    readonly_fields = ('uploaded_at', 'download_count')