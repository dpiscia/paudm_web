from django.db import models

# Create your models here.


class Job(models.Model):
		super_id = models.IntegerField()
		task = models.CharField(max_length=200)
		status = models.CharField(max_length=200)
		input = models.TextField()
		config = models.TextField()
		output = models.TextField()
		ts_created = models.DateTimeField()
		ts_queued = models.DateTimeField()
		ts_stared = models.DateTimeField()
		ts_ended = models.DateTimeField()
		class Meta:
		    db_table = 'job'