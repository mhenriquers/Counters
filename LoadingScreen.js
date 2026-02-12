import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function Loading(){
    return(
        <View style={style.container}>
            {/*o componente de carregamento*/}
            <ActivityIndicator size= 'large' color='21FFB5'/>
        </View>
    );
}

const style = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#000000',
    
    }
})