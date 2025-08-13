import swaggerUI from 'swagger-ui-express';
import createHttpError from 'http-errors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yamljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_BUNDLE = path.join(__dirname, '../../docs/swagger.json');
const YAML_FALLBACK = path.join(__dirname, '../../docs/openapi.yaml');

function loadJsonBundle() {
  if (!fs.existsSync(JSON_BUNDLE)) return null;
  const raw = fs.readFileSync(JSON_BUNDLE, 'utf-8');
  return JSON.parse(raw);
}

function loadYamlFallback() {
  if (!fs.existsSync(YAML_FALLBACK)) return null;
  return YAML.load(YAML_FALLBACK);
}

export const swaggerDocs = () => {
  try {
    let doc = loadJsonBundle();
    if (!doc) {
      doc = loadYamlFallback();
    }
    if (!doc) {
      throw new Error(
        'Не знайдено docs/swagger.json або docs/openapi.yaml. Виконай npm run build-docs',
      );
    }

    // ✅ Завжди масив
    return [swaggerUI.serve, swaggerUI.setup(doc)];
  } catch (e) {
    // ✅ Теж повертаємо масив, навіть у випадку помилки
    return [
      (req, res, next) =>
        next(createHttpError(500, `Can't load swagger docs: ${e.message}`)),
    ];
  }
};
