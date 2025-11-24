import { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { Provider as PaperProvider, Button, Card, Text, ActivityIndicator } from 'react-native-paper';

export default function App() {
  const [places, setPlaces] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://backendo-projeto.onrender.com/api/places';

  useEffect(() => {
    const url = filter ? `${API_URL}?type=${filter}` : API_URL;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setPlaces)
      .catch(err => console.error('Erro ao carregar locais:', err))
      .finally(() => setLoading(false));
  }, [filter]);

  const openMaps = (lat, lng) => {
    Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
  };

  const categories = [
    { key: 'restaurante', label: '🍽 Restaurantes' },
    { key: 'farmacia', label: '💊 Farmácias' },
    { key: 'mercado', label: '🛒 Mercados' },
    { key: 'posto', label: '⛽ Postos' },
    { key: '', label: '🌍 Todos' }
  ];

  return (
    <PaperProvider>
      <Text variant="headlineMedium" style={{ margin: 16, fontWeight: 'bold' }}>
        📍 Localiza Fácil
      </Text>

      <Card style={{ marginHorizontal: 16, marginBottom: 12, padding: 8 }}>
        {categories.map(cat => (
          <Button
            key={cat.key}
            mode={filter === cat.key ? 'contained' : 'outlined'}
            style={{ marginVertical: 4 }}
            onPress={() => setFilter(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
      </Card>

      {loading && <ActivityIndicator animating={true} style={{ marginTop: 20 }} />}

      {!loading && places.length === 0 && (
        <Text style={{ marginTop: 20, textAlign: 'center' }}>Nenhum local encontrado.</Text>
      )}

      {places.map(item => (
        <Card key={item.id} style={{ margin: 12 }}>
          <Card.Title title={item.name} subtitle={item.address} />
          <Card.Actions>
            <Button mode="contained" onPress={() => openMaps(item.lat, item.lng)}>
              Abrir no Maps
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </PaperProvider>
  );
}