module.exports = class {
    initMap(settings){
        return new Promise((resolve, reject) => ymaps.ready(resolve))
            .then(()=>{
                this.map = new ymaps.Map('map', settings);

                return this.map;
            })
    }

    async getCluster (customClusterContentLayout) {
       return this.cluster = await new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            clusterDisableClickZoom: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: customClusterContentLayout
        });
    }
    
    async getMapPosition(e) {
        const coords = e.get('coords');
        const geocode = await ymaps.geocode(coords);
        const address = geocode.geoObjects.get(0).properties.get('text');

        return {
            coords,
            address
        }
    }

    async createBaloon(myMap, point, object, balloonOpened, cluster, customItemContentLayout, customClusterContentLayout) {
        let balloon = balloonOpened;
        let address = point.address;

        if (balloon !== undefined) {
            balloon.close();
        }
        if (cluster.balloon) {
            cluster.balloon.close();
        }

        balloon = await new ymaps.Balloon(myMap, {
            contentLayout: customItemContentLayout
        });


        if (object) {
            balloon.setData(object);
            balloon.options.setParent(myMap.options);
            balloon.open(point.coords);
        } else {
            balloon.setData({
                balloonContentHeader: address
            });
            balloon.options.setParent(myMap.options);
            balloon.open(point.coords, {address});
        }

        return balloon;
    }
}