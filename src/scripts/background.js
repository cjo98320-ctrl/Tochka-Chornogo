/**
 * Шейдерный фон "Black Smoke" для Точка Черного
 * Создает живой, тягучий фон, напоминающий пар от горячего кофе
 */
export function initBackground() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.warn('WebGL not supported');
        return;
    }

    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.6';
    canvas.style.pointerEvents = 'none';

    // Vertex Shader (определяет геометрию)
    const vs = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    // Fragment Shader (математика дыма)
    const fs = `
        precision mediump float;
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;

        // Функция создания "шума" для эффекта дыма
        float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        // Простой шум Перлина для более органичного эффекта
        float pnoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            float a = noise(i);
            float b = noise(i + vec2(1.0, 0.0));
            float c = noise(i + vec2(0.0, 1.0));
            float d = noise(i + vec2(1.0, 1.0));
            
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            float t = time * 0.15;
            
            // Добавляем влияние мыши
            vec2 mouseEffect = (uv - mouse) * 0.3;
            
            // Создаем наслоение волн для эффекта дыма
            float color = 0.0;
            color += sin(uv.x * 8.0 + t + mouseEffect.x) * 0.4;
            color += cos(uv.y * 6.0 - t * 1.2 + mouseEffect.y) * 0.4;
            color += sin((uv.x + uv.y) * 4.0 + t * 0.8);
            color += pnoise(uv * 3.0 + t) * 0.3;

            // Ограничиваем палитру: от черного к глубокому кофейному
            vec3 darkColor = vec3(0.02, 0.02, 0.02); // Почти черный
            vec3 smokeColor = vec3(0.12, 0.08, 0.06); // Кофейный оттенок дыма
            vec3 accentColor = vec3(0.21, 0.17, 0.12); // Более светлый акцент
            
            // Смешиваем цвета на основе шума
            vec3 finalColor = mix(darkColor, smokeColor, color * 0.15);
            finalColor = mix(finalColor, accentColor, abs(color) * 0.08);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    // Функция компиляции шейдеров
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const program = gl.createProgram();
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    
    if (!vertexShader || !fragmentShader) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return;
    }
    
    gl.useProgram(program);

    // Квадрат, закрывающий весь экран
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "time");
    const resLoc = gl.getUniformLocation(program, "resolution");
    const mouseLoc = gl.getUniformLocation(program, "mouse");

    let mouseX = 0.5;
    let mouseY = 0.5;

    // Отслеживаем движение мыши
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = 1.0 - e.clientY / window.innerHeight;
    });

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    });

    function render(now) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        gl.uniform1f(timeLoc, now * 0.001);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform2f(mouseLoc, mouseX, mouseY);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
}
