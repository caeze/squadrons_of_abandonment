# Run this script to replace the import statements in all TypeScript files.
from pathlib import Path


gui_imports = """AdvancedDynamicTexture,
Button,
Container,
Control,
InputText,
Rectangle,
TextBlock,"""
core_imports = """AbstractMesh,
ArcRotateCamera,
ArcRotateCameraPointersInput,
AssetContainer,
AssetsManager,
BoundingInfo,
BoxParticleEmitter,
Camera,
Color3,
Color4,
ColorCurves,
Constants,
CSG,
CubeTexture,
DefaultLoadingScreen,
DefaultRenderingPipeline,
DepthOfFieldEffectBlurLevel,
DirectionalLight,
Effect,
Engine,
FreeCamera,
HemisphericLight,
HighlightLayer,
ImageProcessingPostProcess,
InstancedMesh,
IParticleSystem,
Layer,
LensFlare,
LensFlareSystem,
Material,
MaterialPluginBase,
Matrix,
Mesh,
MeshAssetTask,
MeshBuilder,
NoiseProceduralTexture,
ParticleHelper,
ParticleSystem,
ParticleSystemSet,
PassPostProcess,
Plane,
PointLight,
PointerEventTypes,
PostProcess,
Quaternion,
RegisterMaterialPlugin,
RenderTargetTexture,
Scene,
SceneLoader,
ShaderMaterial,
SphereParticleEmitter,
StandardMaterial,
TextFileAssetTask,
Texture,
Tools,
TransformNode,
UniversalCamera,
Vector2,
Vector3,
Vector4,
VertexBuffer,
VertexData,
Viewport,
VolumetricLightScatteringPostProcess,
WebGPUEngine,"""

typescript_directories = [Path("..") / "src"]
file_extension = ".ts"
preamble = "// ------------- global imports -------------"
postamble = "// ----------- global imports end -----------"
content = """
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
%%%GUI_IMPORTS%%%
} from "@babylonjs/gui/2D";
import {
%%%CORE_IMPORTS%%%
} from "@babylonjs/core";
"""

def replace_between_strings_in_string(text: str, preamble: str, postamble: str, replacement: str) -> str | None:
    try:
        preamble_index = text.index(preamble)
        postamble_index = text.index(postamble)
    except ValueError as e:
        return None
    ret_str = text[: preamble_index + len(preamble)] + replacement + text[postamble_index :]
    return ret_str

path_to_new_content = {}
all_file_paths = []
for d in typescript_directories:
    all_file_paths += [f for f in d.iterdir() if f.is_file() and f.suffix == file_extension]
for path in all_file_paths:
    file_path = path.resolve()
    with open(file_path, "r") as f:
        ts_content = f.read()
        replacement = content.replace("%%%GUI_IMPORTS%%%", gui_imports).replace("%%%CORE_IMPORTS%%%", core_imports)
        ts_content_new = replace_between_strings_in_string(ts_content, preamble, postamble, replacement)
        if ts_content_new is not None:
            path_to_new_content[file_path] = ts_content_new
        else:
            print("Could not find preamble or postamble in file", file_path)
for file_path, new_content in path_to_new_content.items():
    with open(file_path, "w") as f:
        f.write(new_content)
