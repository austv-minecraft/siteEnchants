/* eslint-disable no-unused-vars */
import { parse } from 'yaml';

export async function getEnchantments() {
  const response = await fetch('/enchants.yml');
  const yamlText = await response.text();
  const parsedData = parse(yamlText);

  return Object.entries(parsedData)
  .filter(([_, enchantData]) => enchantData.group !== "CONSOLE" && enchantData.group !== "ESPECIAL") // Não exibir esses enchants de "teste"
  .map(([enchantName, enchantData]) => ({
    id: enchantName,
    display: enchantData.display.replace('%group-color%', ''),
    description: enchantData.description,
    applies: enchantData['applies-to'],
    group: enchantData.group,
    levels: Object.keys(enchantData.levels).length,
  }));

}