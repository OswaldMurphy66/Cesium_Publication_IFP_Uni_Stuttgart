
function TrailLineMaterialProperty(options) {
    // 默认参数设置
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = options.color;
    this.duration = options.duration;
    this._time = (new Date()).getTime();
}
Object.defineProperties(TrailLineMaterialProperty.prototype, {
    isConstant: {
        get: function() {
            return false;
        }
    },
    definitionChanged: {
        get: function() {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});
TrailLineMaterialProperty.prototype.getType = function(time) {
    return 'TrailLine';
};
TrailLineMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);

    if (this.duration) {
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    }
    viewer.scene.requestRender();
    return result;
};
TrailLineMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof TrailLineMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
};
Cesium.TrailLineMaterialProperty = TrailLineMaterialProperty;
Cesium.Material.TrailLineType = 'TrailLine';
Cesium.Material.TrailLineImage = "img_2022/arrow.png";
Cesium.Material.TrailLineSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
     czm_material material = czm_getDefaultMaterial(materialInput);\n\
     vec2 st = materialInput.st;\n\
     vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
     material.alpha = colorImage.a * color.a;\n\
     material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
     return material;\n\
 }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.TrailLineType, {
    fabric: {
        type: Cesium.Material.TrailLineType,
        uniforms: {
            color: new Cesium.Color(1.0, 1.0, 1.0, 1),
            image: Cesium.Material.TrailLineImage,
            time: 0
        },
        source: Cesium.Material.TrailLineSource
    },
    translucent: function(material) {
        return true;
    }
});
