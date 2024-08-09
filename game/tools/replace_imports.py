# Run this script to replace the import statements in the main imports file.
from pathlib import Path


main_imports_file_path = Path("..") / "src" / "import" / "soaImports.ts"
typescript_directories = [Path("..") / "src"]
file_extension = ".ts"
file_to_exclude = "app.ts"

all_file_paths = []
for d in typescript_directories:
    all_file_paths += ["export * from \"../" + f.stem + "\";" for f in d.iterdir() if f.is_file() and f.suffix == file_extension and f.name != file_to_exclude]

file_content_new = "\n".join(sorted(all_file_paths))

with open(main_imports_file_path, "w") as f:
    f.write(file_content_new)

