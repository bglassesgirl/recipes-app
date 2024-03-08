import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert} from "react-native"
import { router } from "expo-router";

import { services } from "@/services";

import { styles } from "./styles"

import { Ingredient } from "@/components/Ingredient";
import { Selected } from "@/components/Selected";
import { Loading } from "@/components/Loading";


export default function Index() {
    const [selected, setSelected] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<IngredientResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)

    function handleToggleSelected(value: string){
        if (selected.includes(value)) {
            return setSelected((state) => state.filter((item) => item !== value))
        }
        setSelected((state) => [...state, value])
    }

    function handleClearSelected(){
        Alert.alert("Limpar", "Deseja limpar tudo?", [
            { text: "Náo", style: "cancel"},
            { text: "Sim", onPress: () => setSelected([]) },
        ])
    }

    function handleSearch (){
        router.navigate("/recipes/" + selected)
    }

    useEffect(() => {
        services.ingredients
            .findAll()
            .then(setIngredients)
            .finally(() => setIsLoading(false))
    }, [])
    if(isLoading){
        return<Loading/>
    }

    return (
        <View style= {styles.container}>
            <Text style={styles.title}>
                Escolha {"\n"}

                <Text style={styles.subtitle} >os produtos</Text>
                </Text>

            <Text style={styles.message}>
                Descubra receitas baseadas nos produtos que vocë escolheu.
            </Text>

            <ScrollView
                contentContainerStyle={styles.ingredients}
                showsHorizontalScrollIndicator={false}
                >
                    {ingredients.map((ingredient) => (
                        <Ingredient
                            key={ingredient.id}
                            name={ingredient.name}
                            image={`${services.storage.imagePath}/${ingredient.image}`}
                            selected= {selected.includes(ingredient.id)}
                            onPress={() => handleToggleSelected(String(ingredient.id))} />
                    ))}
            </ScrollView>

            {selected.length > 0 && (
                <Selected
                    quantity={selected.length}
                    onClear={handleClearSelected}
                    onSearch={handleSearch}
                 />
            )}
        </View>
    )
}