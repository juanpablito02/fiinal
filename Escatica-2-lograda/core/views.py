from django.shortcuts import render, HttpResponse 
from django.template import loader
from Bd_Escatica.models import Usuario  

def main(request):
    template=loader.get_template("core/menu.html")
    return HttpResponse(template.render())

def tablero(request):
    return render(request,"core/tablero.html")


    

def menuUser(request):
    usuario = None
    usuario_id = request.session.get("usuario_id")
    if usuario_id:
        try:
            usuario = Usuario.objects.get(id=usuario_id)
        except Usuario.DoesNotExist:
            usuario = None
    return render(request, "core/menuUser.html", {"usuario": usuario})


def nosotros(request):
    return render(request,"core/nosotros.html")
