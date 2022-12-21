const openPopup = (event, post, method, table) => {

    let title = post?.title || '';
    console.log(title)
    let categories = '';
    post?.categories.forEach(category => categories += `${category},`);
    let content = post?.content || '';

    $("button").hide();
    $("#tabebeladiv").hide();
    $("newPopup").hide();
    $("divisoria").hide();

    $("#body").append('<div id="popup" class="popup"> </div>');
    $("#popup").append('<div id="popupContent" class="popupContent"></div>');
    $("#popupContent").append('<button id="close" class="botao-X"> X </button>');
    $("#close").click(() => {
        table.ajax.reload();
        $("#popup").remove();
        $("button").show();
        $("#tabebeladiv").show();
    });

    $("#popupContent").append('<form id="form" class="form"> </form>');

    $("#form").append('<label for="title" class="titleForm">Título:</label>');
    $("#form").append('<input required type="text" class="escreverclass" id="title">');
    $("#title").val(title);
    $("#title").change((e) => title = e.target.value);

    $("#form").append('<label for="categories" class="titleForm">Categorias (separar por vírgula):</label>');
    $("#form").append('<input required type="text" class="escreverclass" id="categories">');

    $("#categories").val(categories);
    $("#categories").change((e) => categories = e.target.value);

    $("#form").append('<label for="content" class="titleForm">Conteúdo:</label>');
    $("#form").append('<input required type="text" class="escreverclass"  id="content">');
    $("#content").val(content);
    $("#content").change((e) => content = e.target.value);

    $("#form").append('<div id="div1"> </div>');
    $("#div1").append('<button type="submit" class="botao-confirmar" id="submitForm">Confirmar</button>');
    $("#submitForm").click(async (e) => {
        e.preventDefault()
        const newPost = {
            id: post?.id,
            title: title,
            categories: categories.split(','),
            content: content,
            version: post?.version
        }

        if (title.length && categories.length && content.length) {

            if (method == 'post') await createPost(newPost);
            if (method == 'put') await editPost(newPost, newPost.id);
            table.ajax.reload();
            $("#popup").remove();
            $("#tabebeladiv").show();
            $("button").show();
        }

    });

    $("#div1").append('<button type="excluir" class="botao-excluir" id="excluirForm">Excluir</button>');
    $("#excluirForm").click(async (e) => {
        await deletePost(post.id);
        $("#popup").remove();
        $("#tabebeladiv").show();
        $("button").show();

    });

}

const editPost = async (post, id) => {
    console.log('post', post)
    await fetch(
        `https://localhost:4567/postagem/${id}`,
        {
            method: 'PUT',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            mode: 'cors',
            body: JSON.stringify(post),
        })

        .then(ret => console.log(ret.status));
}

const createPost = async (post) => {
    await fetch(
        'https://localhost:4567/postagem',
        {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            mode: 'cors',
            body: JSON.stringify(post),
        })
    // .then(ret => console.log(ret.status));
}

const deletePost = async (id) => {
    if (window.confirm('Apagar post ?')) {
        return await fetch(
            `https://localhost:4567/postagem/${id}`, {
            method: 'DELETE',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            mode: 'cors',
        }
        );
        // return true;
    }
}

$(document).ready(async () => {
    $(newPopup).click((e) => {
        openPopup(e, null, 'post', table);
    });

    var table = $('#table_id').DataTable({
        ajax: {
            url: 'https://localhost:4567/postagem',
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'title' },
            { data: 'categories' },
            { data: 'content' },
        ],
    });

    table.on('click', 'tbody td', function () {
        edit = table.row(this).data();
        openPopup(null, edit, 'put', table);
    });
});