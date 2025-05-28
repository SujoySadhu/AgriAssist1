from django.db import models

# Create your models here.

class PlantDiseaseDetection(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='plant_disease_uploads/')
    result = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Detection at {self.uploaded_at}"
