uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec2 u_speed;
uniform float u_aspect;
uniform float u_opacity;

#define PI 3.14159265359
const mat2 rot = mat2(cos(PI/4.0), -sin(PI/4.0), 
                      sin(PI/4.0), cos(PI/4.0));

vec2 pixelize(float pixelAmount, vec2 uv) {
	return vec2(floor(uv.x * pixelAmount) / pixelAmount, floor(uv.y * pixelAmount) / pixelAmount);
}

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	uv = (uv + vec2(u_time) * u_speed) * vec2(u_aspect, 1.0);
	uv = uv * rot;
	uv = pixelize(200.0, uv);
	vec4 c1 = vec4(u_color1 / 255.0, u_opacity);
	vec4 c2 = vec4(u_color2 / 255.0, u_opacity);
	uv = fract(uv * 10.0);
	float l = length(uv-vec2(0.5));

	return mix(c1, c2, (1.0-step(0.4, l))*step(0.2, l));
}