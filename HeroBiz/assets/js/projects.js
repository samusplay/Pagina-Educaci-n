let pyodide = null;

// Inicializar Pyodide
async function initPyodide() {
    pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    await pyodide.runPythonAsync(`
        import micropip
        await micropip.install('numpy')
    `);
}

// Funciones para el editor de código
async function runCode() {
    if (!pyodide) {
        await initPyodide();
    }

    const code = document.getElementById('codeEditor').value;
    const output = document.getElementById('output');
    
    try {
        // Limpiar la salida anterior
        output.innerHTML = '';
        
        // Capturar la salida de print
        const stdout = [];
        pyodide.runPython(`
            import sys
            from io import StringIO
            sys.stdout = StringIO()
        `);
        
        // Ejecutar el código
        await pyodide.runPythonAsync(code);
        
        // Obtener la salida
        const result = pyodide.runPython("sys.stdout.getvalue()");
        
        // Mostrar la salida
        if (result) {
            output.innerHTML = `<pre>${result}</pre>`;
        } else {
            output.innerHTML = '<pre>El código se ejecutó correctamente, pero no produjo salida.</pre>';
        }
        
        // Restaurar stdout
        pyodide.runPython("sys.stdout = sys.__stdout__");
    } catch (error) {
        output.innerHTML = `<pre class="error">Error: ${error.message}</pre>`;
    }
}

function resetCode() {
    document.getElementById('codeEditor').value = '# Escribe tu código Python aquí\nprint("¡Hola, mundo!")';
    document.getElementById('output').innerHTML = '';
}

// Código de ejemplo para los proyectos
const projectExamples = {
    calculadora: `# Calculadora Básica
def suma(a, b):
    return a + b

def resta(a, b):
    return a - b

def multiplicacion(a, b):
    return a * b

def division(a, b):
    if b == 0:
        return "Error: No se puede dividir por cero"
    return a / b

# Ejemplo de uso
print("Suma:", suma(5, 3))
print("Resta:", resta(5, 3))
print("Multiplicación:", multiplicacion(5, 3))
print("División:", division(5, 3))`,

    adivina: `# Juego Adivina el Número
import random

def adivina_numero():
    numero_secreto = random.randint(1, 100)
    intentos = 0
    
    print("¡Bienvenido al juego Adivina el Número!")
    print("Estoy pensando en un número entre 1 y 100.")
    
    while True:
        try:
            intento = int(input("¿Cuál crees que es el número? "))
            intentos += 1
            
            if intento < numero_secreto:
                print("El número es mayor.")
            elif intento > numero_secreto:
                print("El número es menor.")
            else:
                print(f"¡Felicidades! Adivinaste el número en {intentos} intentos.")
                break
        except ValueError:
            print("Por favor, ingresa un número válido.")

# Iniciar el juego
adivina_numero()`,

    todo: `# Lista de Tareas
class ListaTareas:
    def __init__(self):
        self.tareas = []
    
    def agregar_tarea(self, tarea):
        self.tareas.append({"tarea": tarea, "completada": False})
        print(f"Tarea '{tarea}' agregada.")
    
    def marcar_completada(self, indice):
        if 0 <= indice < len(self.tareas):
            self.tareas[indice]["completada"] = True
            print(f"Tarea '{self.tareas[indice]['tarea']}' marcada como completada.")
        else:
            print("Índice inválido.")
    
    def mostrar_tareas(self):
        if not self.tareas:
            print("No hay tareas pendientes.")
        else:
            for i, tarea in enumerate(self.tareas):
                estado = "✓" if tarea["completada"] else " "
                print(f"{i}. [{estado}] {tarea['tarea']}")

# Ejemplo de uso
mi_lista = ListaTareas()
mi_lista.agregar_tarea("Aprender Python")
mi_lista.agregar_tarea("Practicar ejercicios")
mi_lista.mostrar_tareas()`,

    web: `# Mini Sitio Web con Flask
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def inicio():
    return render_template('inicio.html')

@app.route('/acerca')
def acerca():
    return render_template('acerca.html')

if __name__ == '__main__':
    app.run(debug=True)`
};

// Función para mostrar el código de ejemplo en el editor
function mostrarEjemplo(proyecto) {
    const editor = document.getElementById('codeEditor');
    const output = document.getElementById('output');
    editor.value = projectExamples[proyecto];
    output.innerHTML = '';
}

// Ejercicios prácticos
const ejercicios = {
    variables: {
        titulo: "Variables y Tipos de Datos",
        ejercicios: [
            {
                titulo: "Calculadora de Edad",
                descripcion: "Crea un programa que pida al usuario su año de nacimiento y calcule su edad actual.",
                codigo: `# Escribe tu código aquí
año_actual = 2024
año_nacimiento = int(input("Ingresa tu año de nacimiento: "))
edad = año_actual - año_nacimiento
print(f"Tu edad es: {edad} años")`
            },
            {
                titulo: "Conversor de Temperatura",
                descripcion: "Convierte grados Celsius a Fahrenheit.",
                codigo: `# Escribe tu código aquí
celsius = float(input("Ingresa la temperatura en Celsius: "))
fahrenheit = (celsius * 9/5) + 32
print(f"{celsius}°C equivale a {fahrenheit}°F")`
            }
        ]
    },
    condicionales: {
        titulo: "Condicionales y Bucles",
        ejercicios: [
            {
                titulo: "Adivina el Número",
                descripcion: "Juego donde el usuario debe adivinar un número entre 1 y 100.",
                codigo: `# Escribe tu código aquí
import random

numero_secreto = random.randint(1, 100)
intentos = 0

while True:
    intento = int(input("Adivina el número (1-100): "))
    intentos += 1
    
    if intento < numero_secreto:
        print("El número es mayor")
    elif intento > numero_secreto:
        print("El número es menor")
    else:
        print(f"¡Correcto! Lo adivinaste en {intentos} intentos")
        break`
            }
        ]
    }
};

// Función para mostrar un ejercicio en el modal
function mostrarEjercicio(categoria, indice) {
    const ejercicio = ejercicios[categoria].ejercicios[indice];
    const modal = document.getElementById(`ejercicioModal${indice + 1}`);
    
    // Actualizar el contenido del modal
    modal.querySelector('.modal-title').textContent = ejercicios[categoria].titulo;
    modal.querySelector('h6').textContent = ejercicio.titulo;
    modal.querySelector('p').textContent = ejercicio.descripcion;
    modal.querySelector('textarea').value = ejercicio.codigo;
    
    // Mostrar el modal
    new bootstrap.Modal(modal).show();
}

// Inicializar Pyodide y modales de Bootstrap
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar Pyodide
    await initPyodide();
    
    // Agregar event listeners a los botones de los proyectos
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const proyecto = this.getAttribute('data-proyecto');
            if (proyecto) {
                mostrarEjemplo(proyecto);
            }
        });
    });
    
    // Agregar resaltado de sintaxis al editor
    const editor = document.getElementById('codeEditor');
    editor.addEventListener('input', function() {
        // Aquí podríamos agregar resaltado de sintaxis si se desea
    });

    // Inicializar los modales de ejercicios
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            const indice = this.getAttribute('data-indice');
            if (categoria && indice) {
                mostrarEjercicio(categoria, parseInt(indice));
            }
        });
    });
}); 