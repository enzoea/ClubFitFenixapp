// React
import React from 'react';

// React Native
import { View, Image } from 'react-native';

// Estilos
import { styles } from './styles';

// Tipos
import type { ItemProps } from './types';

// Componentes (fallback para Texto)
// Observação: Este componente depende de `Texto`. Ajuste o import conforme localização real.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Texto = require('../Texto').default ?? (({ children, style }: any) => children);

const Item: React.FC<ItemProps> = ({ item: { nome, imagem, descricao } }) => {
  return (
    <View style={styles.item}>
      <Image source={imagem} style={styles.imagem} />
      <View style={styles.itemDiv}>
        <Texto style={styles.nome}>{nome}</Texto>
        <Texto style={styles.descricao}>{descricao}</Texto>
      </View>
    </View>
  );
};

export default Item;