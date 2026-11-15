O SDK do projeto precisa ser o mesmo do celular
e esse último atualiza automatico

---
# Antes de atualizar

Crie um branch 

- git branch nome

# Como atualizar

## Expo

O projeto precisa que você instale por meio do expo
o novo sdk

npx expo install expo@^version

ex: expo install @expo@^58.0.5

---

depois temos que ajustar as dependências para o novo sdk com o código:

- npx expo install --fix

---

## Navigation

o expo ajusta tudo que esta dentro dele, porém tem coisas que estão fora. O mais crítico é a navegação.

para atualizar primeiro temos que saber qual versão precisamos instalar:

- npm view @react-navigation/native dist-tags  - vê a versão estável atual
- npm view @react-navigation/native-stack peerDependencies - vê oq ela exige (eu não usei)

depois disso rode o comando para instalar

- npx expo install @react-navigation/native@^version
- npx expo install @react-navigation/native-stack@^version


---

para detectar erros

- npx expo-doctor
    - npx expo install -- --verbose
    - npm audit fix
- npx expo install --check