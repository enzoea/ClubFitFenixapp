import React from 'react';
import { View, Image, StyleSheet, FlatList } from 'react-native';

import Texto from '../../componentes/Texto';

export default function Item({ item: { nome, imagem, descricao } }) {
  return <View style={estilos.item}>
        <Image source={imagem} style={estilos.imagem}/>
        <View style={estilos.itemDiv}>
          <Texto style={estilos.nome}>{ nome }</Texto>
          <Texto style={estilos.descricao}>{descricao}</Texto>
        </View>
      </View>
}

const estilos = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemDiv: {
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
    paddingVertical: 16,
    marginHorizontal: 16,
  },

  imagem: {
    width: 46,
    height: 46,
    marginLeft: 20,
  },
  nome: {
    fontSize: 16,
    lineHeight: 26,
    marginLeft: 11,
    color: "#464646"
  },

  descricao: {
    fontSize: 12,
    lineHeight: 26,
    marginLeft: 11,
    color: "#464646"
  },
});