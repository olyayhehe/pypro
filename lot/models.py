from django.db import models

# Create your models here.
class Settings(models.Model):
    """
    MQTT、ZMQ连接配置
    """
    title = models.CharField(verbose_name='标题', max_length=255)
    key = models.CharField(verbose_name='下标', max_length=255)
    value = models.CharField(verbose_name='值', max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    def __str__(self):
        return self.title
    class Meta:
        verbose_name = '配置信息'
        verbose_name_plural = verbose_name


class Clients(models.Model):
    """
    测站信息表
    """
    name = models.CharField(verbose_name='测站名称', max_length=255, null=True)
    client_key = models.CharField(verbose_name='测站唯一索引', max_length=255)
    longitude = models.DecimalField(verbose_name='经度', max_digits=12, decimal_places=8, null=True)
    latitude = models.DecimalField(verbose_name='纬度', max_digits=12, decimal_places=8, null=True)
    topic = models.CharField(verbose_name='主题唯一索引', max_length=255)
    description = models.TextField(verbose_name='描述', null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    def __str__(self):
        return "<名称:%s-站号:%s-主题:%s>" % (self.name,self.client_key,self.topic)
    class Meta:
        verbose_name = '测站信息'
        verbose_name_plural = verbose_name


class Topics(models.Model):
    """
    订阅主题表
    """
    name = models.CharField(verbose_name='标题', max_length=255)
    key = models.CharField(verbose_name='下标', max_length=255)
    topic = models.CharField(verbose_name='主题', max_length=255)
    description = models.TextField(verbose_name='描述', null=True)
    r_client = models.ForeignKey(Clients, on_delete=models.CASCADE, verbose_name="测站",blank=True)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = '测站订阅主题信息'
        verbose_name_plural = verbose_name