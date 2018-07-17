function setUpsellProduct(initialProductId) {
    var upsellMap = {
        '7': {
            id1: '38',
            title1: '5',
            price1: '$189',
            id2: '46',
            title2: '5',
            price2: '$99'
        },
        '5': {
            id1: '36',
            title1: '3',
            price1: '$169',
            id2: '44',
            title2: '3',
            price2: '$89'
        },
        '3': {
            id1: '11',
            title1: '1',
            price1: '$129',
            id2: '42',
            title2: '1',
            price2: '$49'
        },
        '4': {
            id1: '35',
            title1: '2',
            price1: '$149',
            id2: '43',
            title2: '2',
            price2: '$79'
        },
        '6': {
            id1: '37',
            title1: '4',
            price1: '$179',
            id2: '45',
            title2: '4',
            price2: '$89'
        },
        '8': {
            id1: '39',
            title1: '10',
            price1: '$350',
            id2: '47',
            title2: '10',
            price2: '$175'
        },
        '9': {
            id1: '40',
            title1: '15',
            price1: '$525',
            id2: '48',
            title2: '15',
            price2: '$262.50'
        },
        '10': {
            id1: '41',
            title1: '20',
            price1: '$700',
            id2: '49',
            title2: '20',
            price2: '$350'}
    };

    if (initialProductId === null || !upsellMap.hasOwnProperty(initialProductId)) {
        initialProductId = afGetGet('initialProductId');
        if (initialProductId === '' || initialProductId === null || !upsellMap.hasOwnProperty(initialProductId)) {
            initialProductId = '3';
        }
    }

    $('#upsellPrice1').text(upsellMap[initialProductId].price1);
    $('#upsellPrice2').text(upsellMap[initialProductId].price2);
    $('#upsellProduct2').text(upsellMap[initialProductId].price2);
    $('.product-title-1').text(upsellMap[initialProductId].title1);
    $('.product-title-2').text(upsellMap[initialProductId].title2);
    $('#upsellProduct1').attr('productId', upsellMap[initialProductId].id1);
    $('#upsellProduct2').attr('productId', upsellMap[initialProductId].id2);

    return true;
}
