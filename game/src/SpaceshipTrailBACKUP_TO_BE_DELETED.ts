import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { AnimatedInputBlockTypes, VectorMergerBlock, VectorSplitterBlock, InputBlock, SubtractBlock, MultiplyBlock, NormalizeBlock, CrossBlock, TextureBlock, AddBlock, TransformBlock, Matrix, NodeMaterialSystemValues, VertexOutputBlock, Vector2, TrigonometryBlock, TrigonometryBlockOperations, FragmentOutputBlock, Color4, NodeMaterial, NodeMaterialModes, BoxParticleEmitter, NoiseProceduralTexture, DirectionalLight, AbstractMesh, PointLight, Camera, VolumetricLightScatteringPostProcess, SphereParticleEmitter, Constants, ParticleHelper, ParticleSystemSet, TransformNode, ParticleSystem, Engine, Scene, ArcRotateCamera, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, InstancedMesh, StandardMaterial, Texture, Vector4 , Color3, SceneLoader, AssetsManager, ArcRotateCameraPointersInput, CubeTexture, RegisterMaterialPlugin, MaterialPluginBase, PostProcess, PassPostProcess, Effect, ShaderMaterial, RenderTargetTexture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button } from '@babylonjs/gui/2D';

export class SpaceshipTrail {
    public constructor() {
        var nodeMaterial = new NodeMaterial("node");
        nodeMaterial.mode = NodeMaterialModes.Material;

        // InputBlock
        var Float = new InputBlock("Float");
        Float.visibleInInspector = false;
        Float.visibleOnFrame = false;
        Float.target = 1;
        Float.value = 0.5;
        Float.min = 0;
        Float.max = 0;
        Float.isBoolean = false;
        Float.matrixMode = 0;
        Float.animationType = AnimatedInputBlockTypes.None;
        Float.isConstant = false;

        // VectorMergerBlock
        var VectorMerger = new VectorMergerBlock("VectorMerger");
        VectorMerger.visibleInInspector = false;
        VectorMerger.visibleOnFrame = false;
        VectorMerger.target = 4;
        VectorMerger.xSwizzle = "x";
        VectorMerger.ySwizzle = "y";
        VectorMerger.zSwizzle = "z";
        VectorMerger.wSwizzle = "w";

        // VectorSplitterBlock
        var VectorSplitter = new VectorSplitterBlock("VectorSplitter");
        VectorSplitter.visibleInInspector = false;
        VectorSplitter.visibleOnFrame = false;
        VectorSplitter.target = 4;

        // InputBlock
        var uv = new InputBlock("uv");
        uv.visibleInInspector = false;
        uv.visibleOnFrame = false;
        uv.target = 1;
        uv.setAsAttribute("uv");

        // SubtractBlock
        // 0.5
        var Subtract = new SubtractBlock("Subtract");
        Subtract.visibleInInspector = false;
        Subtract.visibleOnFrame = false;
        Subtract.target = 4;

        // InputBlock
        var Float1 = new InputBlock("Float");
        Float1.visibleInInspector = false;
        Float1.visibleOnFrame = false;
        Float1.target = 1;
        Float1.value = 0.5;
        Float1.min = 0;
        Float1.max = 0;
        Float1.isBoolean = false;
        Float1.matrixMode = 0;
        Float1.animationType = AnimatedInputBlockTypes.None;
        Float1.isConstant = false;

        // MultiplyBlock
        var Multiply = new MultiplyBlock("Multiply");
        Multiply.visibleInInspector = false;
        Multiply.visibleOnFrame = false;
        Multiply.target = 4;

        // InputBlock
        var Float2 = new InputBlock("Float");
        Float2.visibleInInspector = false;
        Float2.visibleOnFrame = false;
        Float2.target = 1;
        Float2.value = 2;
        Float2.min = 0;
        Float2.max = 0;
        Float2.isBoolean = false;
        Float2.matrixMode = 0;
        Float2.animationType = AnimatedInputBlockTypes.None;
        Float2.isConstant = false;

        // MultiplyBlock
        var Multiply1 = new MultiplyBlock("Multiply");
        Multiply1.visibleInInspector = false;
        Multiply1.visibleOnFrame = false;
        Multiply1.target = 4;

        // InputBlock
        var Float3 = new InputBlock("Float");
        Float3.visibleInInspector = false;
        Float3.visibleOnFrame = false;
        Float3.target = 1;
        Float3.value = 0.1;
        Float3.min = 0;
        Float3.max = 0;
        Float3.isBoolean = false;
        Float3.matrixMode = 0;
        Float3.animationType = AnimatedInputBlockTypes.None;
        Float3.isConstant = false;

        // VectorMergerBlock
        var VectorMerger1 = new VectorMergerBlock("VectorMerger");
        VectorMerger1.visibleInInspector = false;
        VectorMerger1.visibleOnFrame = false;
        VectorMerger1.target = 4;
        VectorMerger1.xSwizzle = "x";
        VectorMerger1.ySwizzle = "y";
        VectorMerger1.zSwizzle = "z";
        VectorMerger1.wSwizzle = "w";

        // MultiplyBlock
        var Multiply2 = new MultiplyBlock("Multiply");
        Multiply2.visibleInInspector = false;
        Multiply2.visibleOnFrame = false;
        Multiply2.target = 4;

        // NormalizeBlock
        var Normalize = new NormalizeBlock("Normalize");
        Normalize.visibleInInspector = false;
        Normalize.visibleOnFrame = false;
        Normalize.target = 4;

        // CrossBlock
        var Right = new CrossBlock("Right");
        Right.visibleInInspector = false;
        Right.visibleOnFrame = false;
        Right.target = 4;

        // NormalizeBlock
        var Normalize1 = new NormalizeBlock("Normalize");
        Normalize1.visibleInInspector = false;
        Normalize1.visibleOnFrame = false;
        Normalize1.target = 4;

        // SubtractBlock
        var Subtract1 = new SubtractBlock("Subtract");
        Subtract1.visibleInInspector = false;
        Subtract1.visibleOnFrame = false;
        Subtract1.target = 4;

        // TextureBlock
        var tailSampler = new TextureBlock("tailSampler0");
        tailSampler.visibleInInspector = false;
        tailSampler.visibleOnFrame = false;
        tailSampler.target = 3;
        tailSampler.convertToGammaSpace = false;
        tailSampler.convertToLinearSpace = false;
        tailSampler.disableLevelMultiplication = false;

        // AddBlock
        var Add = new AddBlock("Add");
        Add.visibleInInspector = false;
        Add.visibleOnFrame = false;
        Add.target = 4;

        // MultiplyBlock
        var Multiply3 = new MultiplyBlock("Multiply");
        Multiply3.visibleInInspector = false;
        Multiply3.visibleOnFrame = false;
        Multiply3.target = 4;

        // InputBlock
        var Width = new InputBlock("Width");
        Width.visibleInInspector = false;
        Width.visibleOnFrame = false;
        Width.target = 1;
        Width.value = new Vector3(4, 4, 4);
        Width.isConstant = false;

        // TransformBlock
        var WorldPos = new TransformBlock("WorldPos");
        WorldPos.visibleInInspector = false;
        WorldPos.visibleOnFrame = false;
        WorldPos.target = 1;
        WorldPos.complementZ = 0;
        WorldPos.complementW = 1;

        // InputBlock
        var World = new InputBlock("World");
        World.visibleInInspector = false;
        World.visibleOnFrame = false;
        World.target = 1;
        World.value = Matrix.FromArray([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
        World.isConstant = false;

        // TransformBlock
        var WorldPosViewProjectionTransform = new TransformBlock("WorldPos * ViewProjectionTransform");
        WorldPosViewProjectionTransform.visibleInInspector = false;
        WorldPosViewProjectionTransform.visibleOnFrame = false;
        WorldPosViewProjectionTransform.target = 1;
        WorldPosViewProjectionTransform.complementZ = 0;
        WorldPosViewProjectionTransform.complementW = 1;

        // InputBlock
        var ViewProjection = new InputBlock("ViewProjection");
        ViewProjection.visibleInInspector = false;
        ViewProjection.visibleOnFrame = false;
        ViewProjection.target = 1;
        ViewProjection.setAsSystemValue(NodeMaterialSystemValues.ViewProjection);

        // VertexOutputBlock
        var VertexOutput = new VertexOutputBlock("VertexOutput");
        VertexOutput.visibleInInspector = false;
        VertexOutput.visibleOnFrame = false;
        VertexOutput.target = 1;

        // SubtractBlock
        var Subtract2 = new SubtractBlock("Subtract");
        Subtract2.visibleInInspector = false;
        Subtract2.visibleOnFrame = false;
        Subtract2.target = 4;

        // TextureBlock
        var tailSampler1 = new TextureBlock("tailSampler1");
        tailSampler1.visibleInInspector = false;
        tailSampler1.visibleOnFrame = false;
        tailSampler1.target = 3;
        tailSampler1.convertToGammaSpace = false;
        tailSampler1.convertToLinearSpace = false;
        tailSampler1.disableLevelMultiplication = false;

        // AddBlock
        var Add1 = new AddBlock("Add");
        Add1.visibleInInspector = false;
        Add1.visibleOnFrame = false;
        Add1.target = 4;

        // InputBlock
        var Vector = new InputBlock("Vector2");
        Vector.visibleInInspector = false;
        Vector.visibleOnFrame = false;
        Vector.target = 1;
        Vector.value = new Vector2(0, 0.001);
        Vector.isConstant = false;

        // NormalizeBlock
        var Normalize2 = new NormalizeBlock("Normalize");
        Normalize2.visibleInInspector = false;
        Normalize2.visibleOnFrame = false;
        Normalize2.target = 4;

        // InputBlock
        var Cameraposition = new InputBlock("Camera position");
        Cameraposition.visibleInInspector = false;
        Cameraposition.visibleOnFrame = false;
        Cameraposition.target = 1;
        Cameraposition.setAsSystemValue(NodeMaterialSystemValues.CameraPosition);

        // MultiplyBlock
        var Multiply4 = new MultiplyBlock("Multiply");
        Multiply4.visibleInInspector = false;
        Multiply4.visibleOnFrame = false;
        Multiply4.target = 4;

        // InputBlock
        var Float4 = new InputBlock("Float");
        Float4.visibleInInspector = false;
        Float4.visibleOnFrame = false;
        Float4.target = 1;
        Float4.value = 3.14;
        Float4.min = 0;
        Float4.max = 0;
        Float4.isBoolean = false;
        Float4.matrixMode = 0;
        Float4.animationType = AnimatedInputBlockTypes.None;
        Float4.isConstant = false;

        // TrigonometryBlock
        var Sin = new TrigonometryBlock("Sin");
        Sin.visibleInInspector = false;
        Sin.visibleOnFrame = false;
        Sin.target = 4;
        Sin.operation = TrigonometryBlockOperations.Sin;

        // MultiplyBlock
        var Multiply5 = new MultiplyBlock("Multiply");
        Multiply5.visibleInInspector = false;
        Multiply5.visibleOnFrame = false;
        Multiply5.target = 4;

        // TrigonometryBlock
        var Sin1 = new TrigonometryBlock("Sin");
        Sin1.visibleInInspector = false;
        Sin1.visibleOnFrame = false;
        Sin1.target = 4;
        Sin1.operation = TrigonometryBlockOperations.Sin;

        // MultiplyBlock
        var Multiply6 = new MultiplyBlock("Multiply");
        Multiply6.visibleInInspector = false;
        Multiply6.visibleOnFrame = false;
        Multiply6.target = 4;

        // InputBlock
        var Float5 = new InputBlock("Float");
        Float5.visibleInInspector = false;
        Float5.visibleOnFrame = false;
        Float5.target = 1;
        Float5.value = 1.57;
        Float5.min = 0;
        Float5.max = 0;
        Float5.isBoolean = false;
        Float5.matrixMode = 0;
        Float5.animationType = AnimatedInputBlockTypes.None;
        Float5.isConstant = false;

        // FragmentOutputBlock
        var FragmentOutput = new FragmentOutputBlock("FragmentOutput");
        FragmentOutput.visibleInInspector = false;
        FragmentOutput.visibleOnFrame = false;
        FragmentOutput.target = 2;
        FragmentOutput.convertToGammaSpace = false;
        FragmentOutput.convertToLinearSpace = false;
        FragmentOutput.useLogarithmicDepth = false;

        // InputBlock
        var color = new InputBlock("color");
        color.visibleInInspector = false;
        color.visibleOnFrame = false;
        color.target = 1;
        color.value = new Color4(0.00392156862745098, 0.8352941176470589, 0.9921568627450981, 1);
        color.isConstant = false;

        // Connections
        Float.output.connectTo(VectorMerger.x);
        uv.output.connectTo(VectorSplitter.xyIn);
        VectorSplitter.y.connectTo(VectorMerger.y);
        VectorMerger.xy.connectTo(tailSampler.uv);
        tailSampler.rgb.connectTo(Subtract1.left);
        Cameraposition.output.connectTo(Subtract1.right);
        Subtract1.output.connectTo(Normalize1.input);
        Normalize1.output.connectTo(Right.left);
        tailSampler.rgb.connectTo(Subtract2.left);
        VectorMerger.xy.connectTo(Add1.left);
        Vector.output.connectTo(Add1.right);
        Add1.output.connectTo(tailSampler1.uv);
        tailSampler1.rgb.connectTo(Subtract2.right);
        Subtract2.output.connectTo(Normalize2.input);
        Normalize2.output.connectTo(Right.right);
        Right.output.connectTo(Normalize.input);
        Normalize.output.connectTo(Multiply2.left);
        VectorSplitter.x.connectTo(Subtract.left);
        Float1.output.connectTo(Subtract.right);
        Subtract.output.connectTo(Multiply.left);
        Float2.output.connectTo(Multiply.right);
        Multiply.output.connectTo(Multiply1.left);
        Float3.output.connectTo(Multiply1.right);
        Multiply1.output.connectTo(VectorMerger1.x);
        Multiply1.output.connectTo(VectorMerger1.y);
        Multiply1.output.connectTo(VectorMerger1.z);
        VectorMerger1.xyz.connectTo(Multiply2.right);
        Multiply2.output.connectTo(Multiply3.left);
        Width.output.connectTo(Multiply3.right);
        Multiply3.output.connectTo(Add.left);
        tailSampler.rgb.connectTo(Add.right);
        Add.output.connectTo(WorldPos.vector);
        World.output.connectTo(WorldPos.transform);
        WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector);
        ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform);
        WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector);
        color.output.connectTo(FragmentOutput.rgba);
        Multiply.output.connectTo(Multiply4.left);
        Float4.output.connectTo(Multiply4.right);
        Multiply4.output.connectTo(Sin.input);
        Sin.output.connectTo(Multiply5.left);
        VectorSplitter.y.connectTo(Multiply6.left);
        Float5.output.connectTo(Multiply6.right);
        Multiply6.output.connectTo(Sin1.input);
        Sin1.output.connectTo(Multiply5.right);
        Multiply5.output.connectTo(FragmentOutput.a);

        // Output nodes
        nodeMaterial.addOutputNode(VertexOutput);
        nodeMaterial.addOutputNode(FragmentOutput);
        nodeMaterial.build();

    }
}