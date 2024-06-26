# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Empaque(models.Model):
    id_empaque = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=30)
    cantidad_empaque = models.IntegerField()
    cantidad_gastada = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'empaque'


class Entidad(models.Model):
    id_entidad = models.AutoField(primary_key=True)
    nombre_entidad = models.CharField(max_length=50)
    gmail = models.CharField(max_length=100)
    tipo = models.CharField(max_length=9, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'entidad'


class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    fecha_pedido = models.DateField()
    id_usuario = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_usuario')
    total = models.IntegerField()
    estado = models.CharField(max_length=7)
    id_entidad = models.ForeignKey(Entidad, models.DO_NOTHING, db_column='id_entidad', blank=True, null=True)
    conductor = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='conductor', related_name='pedido_conductor_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pedido'


class PedidoParte(models.Model):
    id_pedido_par = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(Pedido, models.DO_NOTHING, db_column='id_pedido')
    cantidad_prod = models.IntegerField()
    cantidad_cajas = models.IntegerField()
    precio = models.FloatField()
    id_empaque = models.ForeignKey(Empaque, models.DO_NOTHING, db_column='id_empaque')
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto')

    class Meta:
        managed = False
        db_table = 'pedido parte'


class Producto(models.Model):
    id_producto = models.IntegerField(primary_key=True)
    nombre_producto = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=255)
    stock = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'producto'


class Transporte(models.Model):
    id_transporte = models.IntegerField(primary_key=True)
    fecha_transporte = models.CharField(max_length=255)
    estado = models.CharField(max_length=11)
    contenido = models.CharField(max_length=255)
    id_pedido = models.ForeignKey(Pedido, models.DO_NOTHING, db_column='id_pedido')

    class Meta:
        managed = False
        db_table = 'transporte'


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    contrasena = models.CharField(max_length=100)
    rol_usuario = models.CharField(max_length=13, blank=True, null=True)
    telefono = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuario'
