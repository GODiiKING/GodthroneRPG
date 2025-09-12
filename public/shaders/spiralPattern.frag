// original shader can be found here: https://www.shadertoy.com/view/wtXyz4
uniform float u_aspect;
uniform float u_time;
uniform float u_opacity;
uniform vec3 u_color;

float spiral(vec2 m, float t) {
	float r = length(m);
	float a = atan(m.y, m.x);
	float v = sin(50.*(sqrt(r)-0.02*a-.3*t));
	return clamp(v,0.,1.);
}

vec2 pixelize(float pixelAmount, vec2 uv) {	
	return vec2(floor(uv.x * pixelAmount) / pixelAmount, floor(uv.y * pixelAmount) / pixelAmount);
}

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	uv.x *= u_aspect;
	uv = pixelize(200.0, uv);

    if (mod(uv.y, 2.) < 1.) {
        uv += 0.4 + sin(u_time * 0.5 + uv.y * 5.0) * (0.3 + sin(u_time) * 0.1);
    } else {
        uv -= 0.4 + sin(u_time * 0.5 + uv.y * 5.0 + 0.5) * (0.3 + sin(u_time) * 0.1);
    }

	vec3 finalColor = (u_color / 255.0) * spiral(uv - .7, u_time * .2 + sin(uv.y * 7.) * .2);
	
	float shortAmt = 4.0;
	finalColor = ceil(finalColor * shortAmt) / shortAmt;

    return vec4(finalColor, u_opacity);
}