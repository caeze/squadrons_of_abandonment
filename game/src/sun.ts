import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Color4, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector2, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button } from '@babylonjs/gui/2D';

export class Sun {
    private name: string;

    public constructor(name: string) {
        this.name = name;
    }

    public createSun(scene: Scene, camera: Camera, engine: Engine) {
        // Emitter object
        //var sunSurface = Mesh.CreateBox("emitter", 0.01, scene);
        //var sunFlares = Mesh.CreateBox("emitter", 0.01, scene);
        //var sunGlare = Mesh.CreateBox("emitter", 0.01, scene);


        // Create a particle system
        var surfaceParticles = new ParticleSystem("surfaceParticles", 1600, scene);
        var flareParticles = new ParticleSystem("flareParticles", 20, scene);
        var glareParticles = new ParticleSystem("glareParticles", 600, scene);

        //Texture of each particle
        surfaceParticles.particleTexture = new Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunSurface.png", scene);
        flareParticles.particleTexture = new Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunFlare.png", scene);
        glareParticles.particleTexture = new Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_Star.png", scene);

        //Create core sphere
        var sunSizeFactor = 1000.0;
        var coreSphere = MeshBuilder.CreateSphere("coreSphere", {diameter: 2.0001 * sunSizeFactor, segments: 64}, scene);
        coreSphere.position = new Vector3(-3 * sunSizeFactor, -3 * sunSizeFactor, 3 * sunSizeFactor);


        var sunLight = new DirectionalLight("sunLight", new Vector3(-coreSphere.position.x, -coreSphere.position.y, -coreSphere.position.z), scene);
        sunLight.intensity = 10.0;
        //sunLight.range = 100000.0;
        const hemisphericLight = new HemisphericLight("hemisphericLight", new Vector3(-coreSphere.position.x, -coreSphere.position.y, -coreSphere.position.z), scene);
        hemisphericLight.intensity = 0.1;
        hemisphericLight.range = 100000.0;

        //Create core material
        var coreMat = new StandardMaterial("coreMat", scene);
        var factor = 0.25;
        coreMat.emissiveColor = new Color3(0.3773*factor, 0.0930*factor, 0.0266*factor); 

        coreSphere.material = coreMat;
        coreMat.disableLighting = true;
        coreMat.backFaceCulling = false;
        //surfaceParticles.particleTexture.backFaceCulling = false;

        // Pre-warm
        surfaceParticles.preWarmStepOffset = 10;
        flareParticles.preWarmStepOffset = 10;
        glareParticles.preWarmStepOffset = 10;
        surfaceParticles.preWarmCycles = 100;
        flareParticles.preWarmCycles = 100;
        glareParticles.preWarmCycles = 100;

        // Initial rotation
        flareParticles.minInitialRotation = 0;
        flareParticles.maxInitialRotation = Math.PI;

        // Where the particles come from
        var emitterType = new SphereParticleEmitter();
        emitterType.radius = 1 * sunSizeFactor;
        emitterType.radiusRange = 0;

        surfaceParticles.emitter = coreSphere; // the starting object, the emitter
        surfaceParticles.particleEmitterType = emitterType;

        flareParticles.emitter = coreSphere; // the starting object, the emitter
        flareParticles.particleEmitterType = emitterType;

        glareParticles.emitter = coreSphere; // the starting object, the emitter
        glareParticles.particleEmitterType = emitterType;

        // Colors of all particles
        //surfaceParticles.color1 = new Color4(1.0, 0.1803, 0.1176, 0.5);
        //surfaceParticles.color2 = new Color4(1.0, 0.1803, 0.1176, 0.5);
        //surfaceParticles.colorDead = new Color4(0, 0, 0.2, 0.0);

        // Gradient
        surfaceParticles.addColorGradient(0, new Color4(0.8509, 0.4784, 0.1019, 0.0));
        surfaceParticles.addColorGradient(0.4, new Color4(0.6259, 0.3056, 0.0619, 0.5));
        surfaceParticles.addColorGradient(0.5, new Color4(0.6039, 0.2887, 0.0579, 0.5));
        surfaceParticles.addColorGradient(1.0, new Color4(0.3207, 0.0713, 0.0075, 0.0));

        flareParticles.addColorGradient(0, new Color4(1, 0.9612, 0.5141, 0.0));
        flareParticles.addColorGradient(0.25, new Color4(0.9058, 0.7152, 0.3825, 1.0));
        flareParticles.addColorGradient(1.0, new Color4(0.6320, 0.0, 0.0, 0.0));

        glareParticles.addColorGradient(0, new Color4(0.8509, 0.4784, 0.1019, 0.0));
        glareParticles.addColorGradient(0.5, new Color4(0.6039, 0.2887, 0.0579, 0.12));
        glareParticles.addColorGradient(1.0, new Color4(0.3207, 0.0713, 0.0075, 0.0));


        // Size of each particle (random between...
        surfaceParticles.minSize = 0.4 * sunSizeFactor;
        surfaceParticles.maxSize = 0.7 * sunSizeFactor;

        flareParticles.minScaleX = 0.5 * sunSizeFactor;
        flareParticles.minScaleY = 0.5 * sunSizeFactor;
        flareParticles.maxScaleX = 1.2 * sunSizeFactor;
        flareParticles.maxScaleY = 1.2 * sunSizeFactor;

        glareParticles.minScaleX = 0.5 * sunSizeFactor;
        glareParticles.minScaleY = 0.75 * sunSizeFactor;
        glareParticles.maxScaleX = 1.2 * sunSizeFactor;
        glareParticles.maxScaleY = 2.0 * sunSizeFactor;

        // Life time of each particle (random between...
        surfaceParticles.minLifeTime = 8.0;
        surfaceParticles.maxLifeTime = 8.0;

        flareParticles.minLifeTime = 5.0;
        flareParticles.maxLifeTime = 5.0;

        glareParticles.minLifeTime = 2.0;
        glareParticles.maxLifeTime= 2.0;

        // Emission rate
        surfaceParticles.emitRate = 100;
        flareParticles.emitRate = 1;
        glareParticles.emitRate = 300;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        //surfaceParticles.blendMode = ParticleSystem.BLENDMODE_ONEONE;
        surfaceParticles.blendMode = ParticleSystem.BLENDMODE_ADD;
        flareParticles.blendMode = ParticleSystem.BLENDMODE_ADD;
        glareParticles.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Set the gravity of all particles
        surfaceParticles.gravity = new Vector3(0, 0, 0);
        flareParticles.gravity = new Vector3(0, 0, 0);
        glareParticles.gravity = new Vector3(0, 0, 0);

        // Angular speed, in radians
        surfaceParticles.minAngularSpeed = -0.25927;
        surfaceParticles.maxAngularSpeed = 0.25927;

        flareParticles.minAngularSpeed = 0.0;
        flareParticles.maxAngularSpeed = 0.1;

        glareParticles.minAngularSpeed = 0.0;
        glareParticles.maxAngularSpeed = 0.1;

        // Speed
        surfaceParticles.minEmitPower = 0;
        surfaceParticles.maxEmitPower = 0;
        surfaceParticles.updateSpeed = 0.01;

        flareParticles.minEmitPower = 0.01;
        flareParticles.maxEmitPower = 0.3;

        glareParticles.minEmitPower = 0.0;
        glareParticles.maxEmitPower = 0.1;

        // No billboard
        surfaceParticles.isBillboardBased = false;
        flareParticles.isBillboardBased = true;
        glareParticles.isBillboardBased = true;

        // Render Order
        glareParticles.renderingGroupId = 2;
        surfaceParticles.renderingGroupId = 2;
        coreSphere.renderingGroupId = 2;
        flareParticles.renderingGroupId = 2;

        var godrays = new VolumetricLightScatteringPostProcess('godrays', 1.0, camera, coreSphere, 100, Texture.BILINEAR_SAMPLINGMODE, engine, false);

        //godrays._volumetricLightScatteringRTT.renderParticles = true;

        godrays.exposure = 0.5;
        godrays.decay = 0.975;
        godrays.weight = 0.98767;
        godrays.density = 0.996;

        // set the godrays texture to be the image.
        //godrays.mesh.material.diffuseTexture = new Texture("textures/BJS-logo_v3.png", scene);
        //godrays.mesh.material.diffuseTexture.hasAlpha = true;

        // Start the particle system
        surfaceParticles.start();
        flareParticles.start();
        glareParticles.start();
    }
}