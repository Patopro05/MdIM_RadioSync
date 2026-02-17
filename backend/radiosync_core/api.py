from django.http import JsonResponse

def status_check(request):
    return JsonResponse({
        "status": "online", 
        "message": "Sistema RadioSync Operativo 🚀"
    })