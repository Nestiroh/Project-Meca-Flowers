# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Empaque(models.Model):
    id_empaque = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=30)
    cantidad_empaque = models.IntegerField()
    cantidad_gastada = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'empaque'


class Entidad(models.Model):
    id_entidad = models.IntegerField(primary_key=True)
    nombre_entidad = models.CharField(max_length=50)
    gmail = models.CharField(max_length=100)
    tipo = models.CharField(max_length=9, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'entidad'


class Pedido(models.Model):
    id_pedido = models.IntegerField(primary_key=True)
    fecha_pedido = models.DateField()
    id_usuario = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_usuario')
    total = models.IntegerField()
    estado = models.CharField(max_length=7)
    id_entidad = models.ForeignKey(Entidad, models.DO_NOTHING, db_column='id_entidad')

    class Meta:
        managed = False
        db_table = 'pedido'


class PedidoParte(models.Model):
    id_pedido_par = models.IntegerField(primary_key=True)
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
    id_usuario = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    contrasena = models.CharField(max_length=100)
    rol_usuario = models.CharField(max_length=13)
    telefono = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuario'
