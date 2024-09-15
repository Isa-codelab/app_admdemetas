const {select, input, checkbox} = require('@inquirer/prompts');

const fs = require('fs').promises;

let mensagem = 'Bem-vindo ao app de metas!';


let metas 

const carregarMetas = async () =>{

    try{
        const dados =  await fs.readFile('metas.json', 'utf-8')
        metas = JSON.parse(dados)
    }
    catch(erro){
        metas = []

    }

}

const salvarMetas = async () =>{

    await fs.writeFile('metas.json', JSON.stringify(metas,null,2))
}

const cadastrarMeta = async () =>{

    const meta = await input({message: "digite a meta:"})

    if(meta.length == 0){
        mensagem = "A meta não pode ser vazia"
        return

    }

    metas.push(

        { value: meta, checked: false}
    
    )

    mensagem = "Meta  cadastrada com sucesso"
}

const listarMetas = async () =>{

    if(metas.length == 0){
        mensagem = "NÃO HÁ METAS!"
        return
    }


    const respostas =  await checkbox({
        message: "Use as setas para mudar de meta de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices:[...metas],
        instructions: false,
    })

    metas.forEach((m)=>{
        m.checked = false

    })//ajeitando erro de lógica

    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada"
        return
    }

    respostas.forEach((resposta) => {

        const meta = metas.find((m) => {
            return m.value == resposta

        })

        meta.checked = true
    }) 

    mensagem = "Meta(s) marcadas como concluídas"

}

const metasRealizadas = async () =>{

    if(metas.length == 0){
        mensagem = "NÃO HÁ METAS!"
        return
    }

    const realizadas = metas.filter((meta) =>{
        return meta.checked

    })

    if(realizadas.length == 0){
        mensagem = "Não existem metas realizadas :("
    }

    await select({
        message: " Metas Realizadas " + realizadas.length,
        choices:[...realizadas]

    })

}

const metasAbertas = async() =>{

    if(metas.length == 0){
        mensagem = "NÃO HÁ METAS!"
        return
    }

    const abertas = metas.filter((meta)=>{
        return meta.checked != true
    })

    if(abertas.length == 0){

        mensagem = "Não existem metas abertas ^^"
        return
    }

    await select({
        message: " Metas Abertas " + abertas.length,
        choices:[...abertas]
    })

}

const metasDeletadas = async() =>{
    if(metas.length == 0){

        mensagem = "NÃO HÁ METAS!"
        return
    }


    const metasDesmarcadas = metas.map((meta)=>{
        return {value: meta.value, checked: false}
    })

    const itemsAdeletar = await checkbox({
        message: "Selecione qual item quer deletar ",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itemsAdeletar.length == 0){
        mensagem = "Nenhum item para deletar"
        return
    }

    itemsAdeletar.forEach((item)=>{

        metas= metas.filter((meta)=>{
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso"

}

const mostrarMensagem = () =>{
    console.clear();

    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async() =>{

    await carregarMetas()

    while(true){

        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({

            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },

                {
                    name: "Listar metas",
                    value: "listar"
                },

                {
                    name: "Metas Realizadas",
                    value: "realizadas"
                },

                {
                    name: "Metas Abertas",
                    value: "abertas"
                },

                {
                    name: "Metas Deletadas",
                    value: "deletar"
                },

                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao){

            case 'cadastrar':
                await cadastrarMeta()
                break

            case 'listar':
                await listarMetas()
                break
            
            case 'realizadas':
                await metasRealizadas()
                break
            
            case 'abertas':
                await metasAbertas()
                break
            
            case 'deletar':
                await metasDeletadas()
                break
                
            case 'sair':
                console.log('Até a próxima')
                return
        }
    }
}

start()