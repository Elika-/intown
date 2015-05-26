/**
 * Created by mirco on 26.05.15.
 */

function DataObject(shortText, service, time) {
    this.short = notNull(shortText, 'short text');
    this.service = notNull(service, 'service');
    this.time = notNull(time, 'date');

}

DataObject.prototype.withMedia = function (media) {
    this.media = notNull(media);
    return this;
}

DataObject.prototype.withUser = function (user) {
    this.user = notNull(user);
    return this;
}

DataObject.prototype.withLocation = function (location) {
    if (!location.adress || (!location.lat || !location.log)) {
        throw {name: 'Parameter is null', message: 'Adress or lat and lon must be set'};
    }
    this.location = location;
    return this;
}

DataObject.prototype.withLongText = function (string) {
    this.text = notNull(text);
    return this;
}

DataObject.prototype.withLink = function (link) {
    this.link = notNull(link);
    return this;
}

function notNull(obj, param) {
    if (obj == null) {
        throw {name: 'Parameter is null', message: param + ' must be set'};
    } else {
        return obj;
    }
}

module.exports = DataObject;