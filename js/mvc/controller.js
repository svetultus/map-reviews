const Map = require('../modules/api.yandex');

export default class {
    constructor(customItemContentLayoutHTML, customClusterContentLayoutHTML) {
        this.myApi = new Map();
        this.reviews = [];
        this.count = 0;
        this.dateOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        this.customItemContentLayoutHTML = customItemContentLayoutHTML;
        this.customClusterContentLayoutHTML = customClusterContentLayoutHTML;

        this.init();
    }

    async init() {
        let that = this;
        this.map = await this.myApi.initMap({
            center: [59.945, 30.264],
            zoom: 15,
            controls: []
        });

        this.point = {address:'', coords: [0,0]};
        
        let customItemContentLayout = await ymaps.templateLayoutFactory.createClass(
            this.customItemContentLayoutHTML, {
                build:  function () {
                    customItemContentLayout.superclass.build.call(this);
                    let form = document.getElementById('mapReviewForm');
                    
                    form.onsubmit = (e) => {
                        e.preventDefault();
                        this.onMapReviewFormSubmit(e, that, form);
                    };
                },
    
                clear: function () {
                    let form = document.getElementById('mapReviewForm');
    
                    form.onsubmit = null;
                    customItemContentLayout.superclass.clear.call(this);
                },
    
                onMapReviewFormSubmit: async function (e, that, form) {
                    
                    let reviewItems = document.querySelector('.mapReviewItems');
                    let reviewItem = document.querySelector('.mapReviewItems .mapReviewItem');
                    let reviewItemsEmpty = document.querySelector('.mapReviewEmpty');
                    let date = (new Date()).toLocaleDateString("ru", that.dateOptions);
    
                    let review = {
                        userName: form.userName.value,
                        orgName: form.orgName.value,
                        time: date,
                        reviewText: form.reviewText.value,
                        address: that.point.address,
                        coords: that.point.coords
                    };
    
                    reviewItems.insertBefore(that.makeHtmlReview(review), reviewItem);
                    if (reviewItemsEmpty) {
                        document.querySelector(".mapReviewWrapper").removeChild(reviewItemsEmpty);
                    }
                    
                    let Placemark = new ymaps.Placemark(that.point.coords, {
                        balloonContentHeader: that.point.address,
                        review: review,
                    }, {
                        balloonContentBodyLayout: customItemContentLayout,
                        balloonPanelMaxMapArea: 0,
                        hasBalloon: false,
                        preset: 'islands#violetIcon'
                    });
                    that.reviews[that.count++] = review;
                    that.saveInStorage(review);
    
                    form.userName.value = '';
                    form.orgName.value = '';
                    form.reviewText.value = '';
    
                    that.cluster.add(Placemark);
                }
            }
        );
        this.customItemContentLayout = customItemContentLayout;

        let customClusterContentLayout = await ymaps.templateLayoutFactory.createClass(
            this.customClusterContentLayoutHTML, {
                build: async function () {
                    customClusterContentLayout.superclass.build.call(this);

                    let object =this._data.geoObject;
                    let linkAddress = document.querySelector('.linkAddress');
                    let currentCoords = this._data.geoObject.geometry._coordinates;
                    const geocode = await ymaps.geocode(currentCoords);
                    const address = geocode.geoObjects.get(0).properties.get('text');
                    
                    linkAddress.onclick =  e =>  {
                        e.preventDefault(); 
                        that.myApi.createBaloon(that.map, {coords: currentCoords, address: address}, object, that.balloon, that.cluster, that.customItemContentLayout, that.customClusterContentLayout);
                    }
                },
    
                clear: function () {
                    let linkAddress = document.querySelector('.linkAddress');
    
                    linkAddress.onclick = null;
                    customClusterContentLayout.superclass.clear.call(this);
                }
            }
        );
        this.customClusterContentLayout = customClusterContentLayout;

        this.cluster = await this.myApi.getCluster(customClusterContentLayout);
        this.map.geoObjects.add(this.cluster);

        this.map.events.add('click', async e => {
            this.point = await this.myApi.getMapPosition(e);
            this.balloon = await this.myApi.createBaloon(this.map, this.point, null, this.balloon, this.cluster, this.customItemContentLayout, this.customClusterContentLayout);
        });

        this.cluster.events.add('click', async (e) => {
            let object = e.get('target');
            this.point = await this.myApi.getMapPosition(e);
    
            if (!object.getGeoObjects) {
                this.balloon = this.myApi.createBaloon(this.map, this.point, object, this.balloon, this.cluster, this.customItemContentLayout, this.customClusterContentLayout);
            } else {
                if (this.balloon !== undefined ) {
                    try {
                        if (this.balloon.getState() !== "CLOSED") {
                            this.balloon.close();
                        }
                    } catch (error) {
                        console.log(this.balloon);
                    }
                }
                this.cluster.balloon.open(this.cluster.getClusters()[0]);
            }
    
        });

        this.initData();
    }

    initData () {
        console.log(this.reviews);

        this.reviews = this.getFromStorage();

        console.log(this.reviews);

        this.reviews.forEach(element => {
            let review = {
                userName: element.userName,
                orgName: element.orgName,
                time: element.time,
                reviewText: element.reviewText,
                address: element.address,
                coords: element.coords
            };
            let Placemark = new ymaps.Placemark(element.coords, {
                balloonContentHeader: element.address,
                review: review,
            }, {
                balloonContentBodyLayout: this.customItemContentLayout,
                balloonPanelMaxMapArea: 0,
                hasBalloon: false,
                preset: 'islands#violetIcon'
            });
            this.cluster.add(Placemark);
        });
    }

    makeHtmlReview (obj) {
        let wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'mapReviewItem');
    
        for (let key in obj) {
            if (!(key === 'coords' || key === 'address')) {
                let elem = document.createElement('span');
                elem.innerText = obj[key];
                elem.setAttribute('class', key);
                wrapper.appendChild(elem);
            }  
        }
        return wrapper;
    }
    
    storageAvailable(type) { 
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    }
    
    saveInStorage (newReview) {
        if (this.storageAvailable('localStorage')) {
            let storage = localStorage;
    
            let reviews = JSON.parse(storage.getItem('reviews'));
    
            if (reviews === null) {
                reviews = [];
            };
            reviews.push(newReview);
            
            storage['reviews'] = JSON.stringify(reviews);
    
        }
    }
    
    getFromStorage () {
        if (this.storageAvailable('localStorage')) {
            let storage = localStorage;
            let reviews = JSON.parse(storage.getItem('reviews'));
    
            if (reviews === null) {
                reviews = [];
            };
    
            return reviews;
        }
    }
}