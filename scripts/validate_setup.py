#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = [
    "package.json",
    "src/server.js",
    "src/public/index.html",
    "src/public/style.css",
    "src/public/app.js",
    "Dockerfile",
    "docker-compose.yml"
]
REQUIRED_DIRS = [
    "src",
    "src/public",
    "tests",
    "scripts"
]


def run_command(command):
    try:
        output = subprocess.check_output(command, text=True).strip()
        return output
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None


def check_node_version():
    output = run_command(["node", "--version"])
    if not output:
        return "error", "Node.js no encontrado en PATH"
    match = re.match(r"v(\d+)", output)
    if not match:
        return "error", f"Version de Node no valida: {output}"
    major = int(match.group(1))
    if major < 20:
        return "error", f"Node.js {major} detectado, se requiere 20"
    return "ok", f"Node.js {output}"


def check_npm():
    output = run_command(["npm", "--version"])
    if not output:
        return "warn", "npm no encontrado, instala dependencias manualmente"
    return "ok", f"npm {output}"


def check_paths():
    results = []
    for path in REQUIRED_FILES:
        full = ROOT / path
        if full.exists():
            results.append(("ok", f"Archivo presente: {path}"))
        else:
            results.append(("error", f"Archivo faltante: {path}"))
    for path in REQUIRED_DIRS:
        full = ROOT / path
        if full.exists():
            results.append(("ok", f"Directorio presente: {path}"))
        else:
            results.append(("error", f"Directorio faltante: {path}"))
    return results


def parse_env_example():
    env_path = ROOT / ".env.example"
    keys = []
    if not env_path.exists():
        return keys
    for line in env_path.read_text().splitlines():
        if not line.strip() or line.strip().startswith("#"):
            continue
        if "=" in line:
            key = line.split("=", 1)[0].strip()
            keys.append(key)
    return keys


def check_env_file():
    env_path = ROOT / ".env"
    if not env_path.exists():
        return "warn", "No existe .env, se usara la configuracion por defecto"
    return "ok", "Archivo .env presente"


def check_package_json():
    pkg_path = ROOT / "package.json"
    if not pkg_path.exists():
        return [("error", "package.json no encontrado")]
    try:
        data = json.loads(pkg_path.read_text())
    except json.JSONDecodeError:
        return [("error", "package.json tiene formato invalido")]
    results = []
    scripts = data.get("scripts", {})
    if "test" in scripts:
        results.append(("ok", "Script test definido"))
    else:
        results.append(("error", "Script test no definido"))
    dependencies = data.get("dependencies", {})
    for dep in ["express", "sqlite3", "node-telegram-bot-api"]:
        if dep in dependencies:
            results.append(("ok", f"Dependencia {dep} definida"))
        else:
            results.append(("error", f"Dependencia {dep} faltante"))
    return results


def summarize(results):
    errors = sum(1 for status, _ in results if status == "error")
    warnings = sum(1 for status, _ in results if status == "warn")
    return errors, warnings


def main():
    results = []
    results.append(check_node_version())
    results.append(check_npm())
    results.append(check_env_file())
    results.extend(check_paths())
    results.extend(check_package_json())

    env_keys = parse_env_example()
    if env_keys:
        results.append(("ok", f"Variables en .env.example: {', '.join(env_keys)}"))

    for status, message in results:
        label = status.upper().ljust(6)
        print(f"{label} {message}")

    errors, warnings = summarize(results)
    print("")
    print(f"Errores: {errors}  Advertencias: {warnings}")

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
