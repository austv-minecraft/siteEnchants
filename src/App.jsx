import { useState } from "react";
import "./App.css";
import { getEnchantments } from "/src/utils/enchantsExtractor";
import { useEffect } from "react";
import Header from "./components/Structure/Header";
import EnchantedBook from "/public/EnchantedBook.gif";

function App() {
  const [data, setData] = useState([]);
  const [applies, setApplies] = useState(null);
  const [group, setGroup] = useState(null);
  const [enchants, setEnchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enchantSelected, setEnchant] = useState(null);
  const [search, setSearch] = useState("");

  async function loadAndDisplayEnchants() {
    try {
      const enchantsExtracted = await getEnchantments();
      console.log(enchantsExtracted); // Agora você tem o array de encantamentos
      // Faça algo com os dados aqui
      return enchantsExtracted;
    } catch (error) {
      console.error("Erro ao carregar encantamentos:", error);
    }
  }

  useEffect(() => {
    async function fetchEnchants() {
      const data = await loadAndDisplayEnchants();
      setData(data);
      setLoading(false);
    }

    fetchEnchants();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [group, applies, search]);

  useEffect(() => {
    if (data.length > 0) {
      handleFilter();
    }
  }, [data, group, applies, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  
  const handleApplies = (e) => {
    setApplies(e.target.value === "Qualquer" ? null : e.target.value);
  };
  
  const handleGroup = (e) => {
    setGroup(e.target.value === "Qualquer" ? null : e.target.value);
  };

  function handleFilter() {
    const enchantsFiltered = filterEnchants();
    setEnchants(enchantsFiltered);
  }

  function filterEnchants() {
    if (!Array.isArray(data)) {
      console.error("O parâmetro data deve ser um array");
      return [];
    }

    return data.filter((enchant) => {
      if (group && enchant.group.toLowerCase() !== group.toLowerCase()) {
        return false;
      }

      if (applies && enchant.applies.toLowerCase() !== applies.toLowerCase()) {
        return false;
      }

      if (
        search &&
        !enchant.display.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }

  function formatDescription(description) {
    if (!description) return null;
  
    // Remove códigos de cor
    const cleaned = description.replace(/&[ebf78ac]/g, '');
  
    // Divide no primeiro "»"
    const parts = cleaned.split('»').map((item) => item.trim()).filter(Boolean);
  
    const firstPart = parts[0]; // antes da primeira »
    const tips = parts.slice(1); // todas as demais
  
    return (
      <div>
        <p className="enchantment-description">{firstPart}</p>
        {tips.map((tip, index) => (
          <p key={index} className="enchantment-tips">{tip}</p>
        ))}
      </div>
    );
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <>
      <Header />

      <section className="filters-form">
        <div>
          <form>
            <select onChange={handleApplies}>
              <option>Qualquer</option>
              <option>Armaduras</option>
              <option>Armas</option>
              <option>Machados</option>
              <option>Capacetes</option>
              <option>Peitorais</option>
              <option>Calças</option>
              <option>Botas</option>
              <option>Elytra</option>
              <option>Vara de Pesca</option>
              <option>Tesouras</option>
              <option>Armas e Disparáveis</option>
              <option>Armas e Tridentes</option>
              <option>Escudos</option>
              <option>Machados e tridentes</option>
              <option>Arcos</option>
              <option>Picaretas</option>
              <option>Enxadas</option>
              <option>Ferramentas</option>
              <option>Pás</option>
            </select>

            <select onChange={handleGroup}>
              <option value={null}>Qualquer</option>
              <option value={"simples"}>Simples</option>
              <option value={"raro"}>Raro</option>
              <option value={"ultra"}>Ultra</option>
              <option value={"heroico"}>Heroico</option>
              <option value={"lendario"}>Lendario</option>
              <option value={"maestria"}>Maestria</option>
              <option value={"magicos"}>Magicos</option>
              <option value={"divino"}>Divino</option>
              <option value={"sinistro"}>Sinistro</option>
            </select>

            <input value={search} onChange={handleSearch} type="text"></input>
          </form>
        </div>
      </section>

      <section className="main-container">
        <div className="enchants">
          {enchants.map((enchant, i) => (
            <div className="enchant-container" key={i}>
              <div
                className={`enchant-box ${enchant.group.toLowerCase()}`}
                key={enchant.id}
                onClick={() => setEnchant(enchant)}
              >
                <img src={EnchantedBook} alt="Logo React"></img>
              </div>
              <span>{enchant.display}</span>
            </div>
          ))}
        </div>
        <div className="description">
          {enchantSelected ? (
            <div className="enchantment-info">
              <h1 className={`group-color-${enchantSelected.group.toLowerCase()}`}>{enchantSelected.display}</h1>
              <p>Categoria: {enchantSelected.group}</p>
              <p>Níveis: {enchantSelected.levels}</p>
              <p>Aplicação: {enchantSelected.applies}</p>
              <br></br><br></br>
              {formatDescription(enchantSelected.description)}
            </div>
          ) : (
            <div>
              <p>As informações de um encantamento aparecerão aqui.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default App;
