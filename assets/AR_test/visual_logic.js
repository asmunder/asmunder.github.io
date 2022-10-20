/**
 * Generated by Verge3D Puzzles v.3.9.1
 * Wed Mar 30 2022 22:34:37 GMT+0200 (sentraleuropeisk sommertid)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};




PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    var PROC = {
    
};

// initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = true;
_initGlob.output.initOptions.useBkgTransp = true;
_initGlob.output.initOptions.preserveDrawBuf = false;
_initGlob.output.initOptions.useCompAssets = false;
_initGlob.output.initOptions.useFullscreen = true;

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}



var PROC = {
    
};

// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}





/**
 * Retrieve coordinate system from the loaded scene
 */
function getCoordSystem() {
    var scene = appInstance.scene;

    if (scene && "v3d" in scene.userData && "coordSystem" in scene.userData.v3d) {
        return scene.userData.v3d.coordSystem;
    } else {
        // COMPAT: <2.17, consider replacing to 'Y_UP_RIGHT' for scenes with unknown origin
        return 'Z_UP_RIGHT';
    }
}


/**
 * Transform coordinates from one space to another
 * Can be used with Vector3 or Euler.
 */
function coordsTransform(coords, from, to, noSignChange) {

    if (from == to)
        return coords;

    var y = coords.y, z = coords.z;

    if (from == 'Z_UP_RIGHT' && to == 'Y_UP_RIGHT') {
        coords.y = z;
        coords.z = noSignChange ? y : -y;
    } else if (from == 'Y_UP_RIGHT' && to == 'Z_UP_RIGHT') {
        coords.y = noSignChange ? z : -z;
        coords.z = y;
    } else {
        console.error('coordsTransform: Unsupported coordinate space');
    }

    return coords;
}


/**
 * Verge3D euler rotation to Blender/Max shortest.
 * 1) Convert from intrinsic rotation (v3d) to extrinsic XYZ (Blender/Max default
 *    order) via reversion: XYZ -> ZYX
 * 2) swizzle ZYX->YZX
 * 3) choose the shortest rotation to resemble Blender's behavior
 */
var eulerV3DToBlenderShortest = function() {

    var eulerTmp = new v3d.Euler();
    var eulerTmp2 = new v3d.Euler();
    var vec3Tmp = new v3d.Vector3();

    return function(euler, dest) {

        var eulerBlender = eulerTmp.copy(euler).reorder('YZX');
        var eulerBlenderAlt = eulerTmp2.copy(eulerBlender).makeAlternative();

        var len = eulerBlender.toVector3(vec3Tmp).lengthSq();
        var lenAlt = eulerBlenderAlt.toVector3(vec3Tmp).lengthSq();

        dest.copy(len < lenAlt ? eulerBlender : eulerBlenderAlt);
        return coordsTransform(dest, 'Y_UP_RIGHT', 'Z_UP_RIGHT');
    }

}();




function RotationInterface() {
    /**
     * For user manipulations use XYZ extrinsic rotations (which
     * are the same as ZYX intrinsic rotations)
     *     - Blender/Max/Maya use extrinsic rotations in the UI
     *     - XYZ is the default option, but could be set from
     *       some order hint if exported
     */
    this._userRotation = new v3d.Euler(0, 0, 0, 'ZYX');
    this._actualRotation = new v3d.Euler();
}

Object.assign(RotationInterface, {
    initObject: function(obj) {
        if (obj.userData.v3d.puzzles === undefined) {
            obj.userData.v3d.puzzles = {}
        }
        if (obj.userData.v3d.puzzles.rotationInterface === undefined) {
            obj.userData.v3d.puzzles.rotationInterface = new RotationInterface();
        }

        var rotUI = obj.userData.v3d.puzzles.rotationInterface;
        rotUI.updateFromObject(obj);
        return rotUI;
    }
});

Object.assign(RotationInterface.prototype, {

    updateFromObject: function(obj) {
        var SYNC_ROT_EPS = 1e-8;

        if (!this._actualRotation.equalsEps(obj.rotation, SYNC_ROT_EPS)) {
            this._actualRotation.copy(obj.rotation);
            this._updateUserRotFromActualRot();
        }
    },

    getActualRotation: function(euler) {
        return euler.copy(this._actualRotation);
    },

    setUserRotation: function(euler) {
        // don't copy the order, since it's fixed to ZYX for now
        this._userRotation.set(euler.x, euler.y, euler.z);
        this._updateActualRotFromUserRot();
    },

    getUserRotation: function(euler) {
        return euler.copy(this._userRotation);
    },

    _updateUserRotFromActualRot: function() {
        var order = this._userRotation.order;
        this._userRotation.copy(this._actualRotation).reorder(order);
    },

    _updateActualRotFromUserRot: function() {
        var order = this._actualRotation.order;
        this._actualRotation.copy(this._userRotation).reorder(order);
    }

});




// setObjTransform puzzle
function setObjTransform(objSelector, isWorldSpace, mode, vector, offset){
    var x = vector[0];
      var y = vector[1];
      var z = vector[2];

    var objNames = retrieveObjectNames(objSelector);

    function setObjProp(obj, prop, val) {
        if (!offset) {
            obj[mode][prop] = val;
        } else {
            if (mode != "scale")
                obj[mode][prop] += val;
            else
                obj[mode][prop] *= val;
        }
    }

    var inputsUsed = _pGlob.vec3Tmp.set(Number(x !== ''), Number(y !== ''),
            Number(z !== ''));
    var coords = _pGlob.vec3Tmp2.set(x || 0, y || 0, z || 0);

    if (mode === 'rotation') {
        // rotations are specified in degrees
        coords.multiplyScalar(v3d.MathUtils.DEG2RAD);
    }

    var coordSystem = getCoordSystem();

    coordsTransform(inputsUsed, coordSystem, 'Y_UP_RIGHT', true);
    coordsTransform(coords, coordSystem, 'Y_UP_RIGHT', mode === 'scale');

    for (var i = 0; i < objNames.length; i++) {

        var objName = objNames[i];
        if (!objName) continue;

        var obj = getObjectByName(objName);
        if (!obj) continue;

        if (isWorldSpace && obj.parent) {
            obj.matrixWorld.decomposeE(obj.position, obj.rotation, obj.scale);

            if (inputsUsed.x) setObjProp(obj, "x", coords.x);
            if (inputsUsed.y) setObjProp(obj, "y", coords.y);
            if (inputsUsed.z) setObjProp(obj, "z", coords.z);

            obj.matrixWorld.composeE(obj.position, obj.rotation, obj.scale);
            obj.matrix.multiplyMatrices(_pGlob.mat4Tmp.copy(obj.parent.matrixWorld).invert(), obj.matrixWorld);
            obj.matrix.decompose(obj.position, obj.quaternion, obj.scale);

        } else if (mode === 'rotation' && coordSystem == 'Z_UP_RIGHT') {
            // Blender/Max coordinates

            // need all the rotations for order conversions, especially if some
            // inputs are not specified
            var euler = eulerV3DToBlenderShortest(obj.rotation, _pGlob.eulerTmp);
            coordsTransform(euler, coordSystem, 'Y_UP_RIGHT');

            if (inputsUsed.x) euler.x = offset ? euler.x + coords.x : coords.x;
            if (inputsUsed.y) euler.y = offset ? euler.y + coords.y : coords.y;
            if (inputsUsed.z) euler.z = offset ? euler.z + coords.z : coords.z;

            /**
             * convert from Blender/Max default XYZ extrinsic order to v3d XYZ
             * intrinsic with reversion (XYZ -> ZYX) and axes swizzling (ZYX -> YZX)
             */
            euler.order = "YZX";
            euler.reorder(obj.rotation.order);
            obj.rotation.copy(euler);

        } else if (mode === 'rotation' && coordSystem == 'Y_UP_RIGHT') {
            // Maya coordinates

            // Use separate rotation interface to fix ambiguous rotations for Maya,
            // might as well do the same for Blender/Max.

            var rotUI = RotationInterface.initObject(obj);
            var euler = rotUI.getUserRotation(_pGlob.eulerTmp);
            // TODO(ivan): this probably needs some reasonable wrapping
            if (inputsUsed.x) euler.x = offset ? euler.x + coords.x : coords.x;
            if (inputsUsed.y) euler.y = offset ? euler.y + coords.y : coords.y;
            if (inputsUsed.z) euler.z = offset ? euler.z + coords.z : coords.z;

            rotUI.setUserRotation(euler);
            rotUI.getActualRotation(obj.rotation);
        } else {
            if (inputsUsed.x) setObjProp(obj, "x", coords.x);
            if (inputsUsed.y) setObjProp(obj, "y", coords.y);
            if (inputsUsed.z) setObjProp(obj, "z", coords.z);

        }

        obj.updateMatrixWorld(true);
    }

}



// setCameraParam puzzle
function setCameraParam(type, objSelector, param) {

    var objNames = retrieveObjectNames(objSelector);

    objNames.forEach(function(objName) {
        if (!objName)
            return;

        var obj = getObjectByName(objName);
        if (!obj || !obj.isCamera) return;

        if (!(obj.isPerspectiveCamera || obj.isOrthographicCamera)) {
            console.error('setCameraParam: Incompatible camera type, have to be perspective or orthographic');
            return;
        }

        let isSetOrbitParam = false;
        switch (type) {
            case 'ORBIT_MIN_DISTANCE_PERSP':
            case 'ORBIT_MAX_DISTANCE_PERSP':
            case 'ORBIT_MIN_ZOOM_ORTHO':
            case 'ORBIT_MAX_ZOOM_ORTHO':
            case 'ORBIT_MIN_VERTICAL_ANGLE':
            case 'ORBIT_MAX_VERTICAL_ANGLE':
            case 'ORBIT_MIN_HORIZONTAL_ANGLE':
            case 'ORBIT_MAX_HORIZONTAL_ANGLE':
                isSetOrbitParam = true;
        }
        let isSetControlsParam = ( type === 'ROTATION_SPEED' || type === 'MOVEMENT_SPEED' ||
                type === 'ALLOW_PANNING' || type === 'KEYBOARD_CONTROLS' || isSetOrbitParam);
        if (isSetControlsParam) {
            if (!obj.controls) {
                console.error('setCameraParam: The "' + objName +'" camera has no controller');
                return;
            } else if (isSetOrbitParam && obj.controls.type != 'ORBIT') {
                console.error('setCameraParam: Incompatible camera controller');
                return;
            }
        }

        switch (type) {
            case 'FIELD_OF_VIEW':
                if (obj.isPerspectiveCamera) {
                    obj.fov = param;
                    obj.updateProjectionMatrix();
                } else {
                    console.error('setCameraParam: Incompatible camera type, have to be perspective');
                    return;
                }
                break;
            case 'ORTHO_SCALE':
                if (obj.isOrthographicCamera) {
                    obj.zoom = param;
                    obj.updateProjectionMatrix();
                } else {
                    console.error('setCameraParam: Incompatible camera type, have to be orthographic');
                    return;
                }
                break;
            case 'ROTATION_SPEED':
                obj.controls.rotateSpeed = param;
                break;
            case 'MOVEMENT_SPEED':
                obj.controls.moveSpeed = param;
                break;
            case 'ALLOW_PANNING':
                obj.controls.enablePan = param;
                break;
            case 'KEYBOARD_CONTROLS':
                obj.controls.enableKeys = param;
                break;
            case 'ORBIT_MIN_DISTANCE_PERSP':
                if (obj.isPerspectiveCamera) {
                    obj.controls.orbitMinDistance = param;
                } else {
                    console.error('setCameraParam: Incompatible camera type, have to be perspective');
                    return;
                }
                break;
            case 'ORBIT_MAX_DISTANCE_PERSP':
                if (obj.isPerspectiveCamera) {
                    obj.controls.orbitMaxDistance = param;
                } else {
                    console.error('setCameraParam: Incompatible camera type, have to be perspective');
                    return;
                }
                break;
            case 'ORBIT_MIN_ZOOM_ORTHO':
                if (obj.isOrthographicCamera) {
                    obj.controls.orbitMinZoom = param;
                } else {
                    console.error('setCameraParam: Incompatible camera type, have to be orthographic');
                    return;
                }
                break;
            case 'ORBIT_MAX_ZOOM_ORTHO':
                if (obj.isOrthographicCamera) {
                    obj.controls.orbitMaxZoom = param;
                } else {
                    console.error('setCameraParam: Incompatible camera type, have to be orthographic');
                    return;
                }
                break;
            case 'ORBIT_MIN_VERTICAL_ANGLE':
                obj.controls.orbitMinPolarAngle = v3d.MathUtils.degToRad(param);
                break;
            case 'ORBIT_MAX_VERTICAL_ANGLE':
                obj.controls.orbitMaxPolarAngle = v3d.MathUtils.degToRad(param);
                break;
            case 'ORBIT_MIN_HORIZONTAL_ANGLE':
                obj.controls.orbitMinAzimuthAngle = v3d.MathUtils.degToRad(param);
                break;
            case 'ORBIT_MAX_HORIZONTAL_ANGLE':
                obj.controls.orbitMaxAzimuthAngle = v3d.MathUtils.degToRad(param);
                break;
            case 'CLIP_START':
                obj.near = param;
                obj.updateProjectionMatrix();
                break;
            case 'CLIP_END':
                obj.far = param;
                obj.updateProjectionMatrix();
                break;
        }

        if (isSetControlsParam)
            appInstance.enableControls();
    });
}



// arHitPoint puzzle
function arHitPoint(coord) {

    if (!_pGlob.arHitPoint) {
        if (coord == 'xyz')
            return [0, 0, 0];
        else
            return 0;
    }

    var hitPoint = coordsTransform(_pGlob.vec3Tmp.copy(_pGlob.arHitPoint), 'Y_UP_RIGHT', getCoordSystem());

    if (coord == 'xyz')
        return hitPoint.toArray();
    else
        return hitPoint[coord];
}



// arHitTest puzzle
_pGlob.arHitPoint = new v3d.Vector3(0, 0, 0);

function arHitTest(cbHit, cbMiss, smooth) {
    appInstance.renderer.xr.arHitTest(0, 0, function(point) {

        smooth = v3d.MathUtils.clamp(smooth, 0, 1);

        var x = point.x;
        var y = point.y;
        var z = point.z;

        _pGlob.arHitPoint.x = _pGlob.arHitPoint.x * smooth + (1 - smooth) * x;
        _pGlob.arHitPoint.y = _pGlob.arHitPoint.y * smooth + (1 - smooth) * y;
        _pGlob.arHitPoint.z = _pGlob.arHitPoint.z * smooth + (1 - smooth) * z;

        cbHit();
    }, cbMiss);
}



// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (v3d.PL.editorEventListeners)
        v3d.PL.editorEventListeners.push([elem, eventType, pickListener]);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, pickListener);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, pickListener]);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, doubleTapCallback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, doubleTapCallback]);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {

        // to handle unload in loadScene puzzle
        if (!appInstance.getCamera())
            return;

        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.getCamera(true));
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        callback(intersects, event);
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



function _pGetInputSource(controller) {
    if (controller && controller.userData.v3d && controller.userData.v3d.inputSource) {
        return controller.userData.v3d.inputSource
    } else {
        return null;
    }
};

function _pTraverseNonControllers(obj, callback) {

    if (obj.name.startsWith('XR_CONTROLLER_'))
        return;

    callback(obj);

    var children = obj.children;

    for (var i = 0, l = children.length; i < l; i++) {

        _pTraverseNonControllers(children[i], callback);

    }

};

function _pXRGetIntersections(controller) {

    controller.updateMatrixWorld(true);

    _pGlob.mat4Tmp.identity().extractRotation(controller.matrixWorld);

    var objList = [];

    _pTraverseNonControllers(appInstance.scene, function(obj) {
        objList.push(obj);
    });

    var raycaster = new v3d.Raycaster();
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(_pGlob.mat4Tmp);

    return raycaster.intersectObjects(objList);

}

function _pXROnSelect(event) {

    if (!_pGlob.objClickInfo)
        return;

    var controller = event.target;

    var intersections = _pXRGetIntersections(controller);

    if (intersections.length > 0) {
        var intersection = intersections[0];
        var obj = intersection.object;

        // save the object for the pickedObject block
        _pGlob.pickedObject = getPickedObjectName(obj);

        _pGlob.objClickInfo.forEach(function(el) {
            var isPicked = obj && objectsIncludeObj(retrieveObjectNames(el.objSelector), getPickedObjectName(obj));
            el.callbacks[isPicked ? 0 : 1]();
        });
    } else {
        _pGlob.objClickInfo.forEach(function(el) {
            // missed
            el.callbacks[1]();
        });
    }

}



// enterARMode puzzle
function enterARMode(refSpace, allowHTML, enterCb, exitCb, unAvailableCb) {

    switch (refSpace) {
        case 'SITTING':
            var referenceSpace = 'local-floor';
            break;
        case 'WALKING':
            var referenceSpace = 'unbounded';
            break;
        case 'ORIGIN':
            var referenceSpace = 'local';
            break;
        case 'ROOM':
            var referenceSpace = 'bounded-floor';
            break;
        case 'VIEWER':
            var referenceSpace = 'viewer';
            break;
        default:
            console.error('puzzles: Wrong VR reference space');
            return;
    }


    appInstance.initWebXR('immersive-ar', referenceSpace, function() {

        var controllers = appInstance.xrControllers;

        for (var i = 0; i < controllers.length; i++) {
            var controller = controllers[i];

            controller.addEventListener('select', _pXROnSelect);
            if (v3d.PL.editorEventListeners)
                v3d.PL.editorEventListeners.push([controller, 'select', _pXROnSelect]);

            _pGlob.xrSessionCallbacks.forEach(function(pair) {
                controller.addEventListener(pair[0], pair[1]);
                if (v3d.PL.editorEventListeners)
                    v3d.PL.editorEventListeners.push([controller, pair[0], pair[1]]);
            });
        }

        _pGlob.xrSessionAcquired = true;

        enterCb();

    }, unAvailableCb, function() {

        var controllers = appInstance.xrControllers;

        for (var i = 0; i < controllers.length; i++) {
            var controller = controllers[i];

            controller.removeEventListener('select', _pXROnSelect);

            _pGlob.xrSessionCallbacks.forEach(function(pair) {
                controller.removeEventListener(pair[0], pair[1]);
            });
        }

        _pGlob.xrSessionAcquired = false;

        exitCb();

    }, { domOverlay: allowHTML });
}



// whenClicked puzzle
function registerOnClick(objSelector, xRay, doubleClick, mouseButtons, cbDo, cbIfMissedDo) {

    // for AR/VR
    _pGlob.objClickInfo = _pGlob.objClickInfo || [];

    _pGlob.objClickInfo.push({
        objSelector: objSelector,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);
            var objNames = retrieveObjectNames(objSelector);

            if (objectsIncludeObj(objNames, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject = objName;
                isPicked = true;
                cbDo(event);
            }
        }

        if (!isPicked) {
            _pGlob.pickedObject = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'mousedown', false, mouseButtons);
}



// getObjTransform puzzle
function getObjTransform(objName, isWorldSpace, mode, coord) {
    if (!objName)
        return;
    var obj = getObjectByName(objName);
    if (!obj)
        return;

    var coordSystem = getCoordSystem();

    var transformVal;

    if (isWorldSpace && obj.parent) {
        if (mode === 'position') {
            transformVal = coordsTransform(obj.getWorldPosition(_pGlob.vec3Tmp), 'Y_UP_RIGHT',
                coordSystem, mode === 'scale');
        } else if (mode === 'rotation') {
            transformVal = coordsTransform(obj.getWorldEuler(_pGlob.eulerTmp, 'XYZ'), 'Y_UP_RIGHT',
                coordSystem, mode === 'scale');
        } else if (mode === 'scale') {
            transformVal = coordsTransform(obj.getWorldScale(_pGlob.vec3Tmp), 'Y_UP_RIGHT',
                coordSystem, mode === 'scale');
        }

    } else if (mode === 'rotation' && coordSystem == 'Z_UP_RIGHT') {
        transformVal = eulerV3DToBlenderShortest(obj.rotation,
                _pGlob.eulerTmp);

    } else if (mode === 'rotation' && coordSystem == 'Y_UP_RIGHT') {
        // Maya coordinates
        // Use separate rotation interface to fix ambiguous rotations for Maya,
        // might as well do the same for Blender/Max.

        var rotUI = RotationInterface.initObject(obj);
        transformVal = rotUI.getUserRotation(_pGlob.eulerTmp);

    } else {
        transformVal = coordsTransform(obj[mode].clone(), 'Y_UP_RIGHT',
                coordSystem, mode === 'scale');
    }

    if (mode === 'rotation') {
        transformVal.x = v3d.MathUtils.radToDeg(transformVal.x);
        transformVal.y = v3d.MathUtils.radToDeg(transformVal.y);
        transformVal.z = v3d.MathUtils.radToDeg(transformVal.z);
    }

    if (coord == 'xyz') {
        // remove order component for Euler vectors
        return transformVal.toArray().slice(0, 3);
    } else {
        return transformVal[coord];
    }
}



// setObjDirection puzzle
function setObjDirection(objSelector, vector, isPoint, lockUp) {
    var objNames = retrieveObjectNames(objSelector);
    var x = vector[0] || 0;
      var y = vector[1] || 0;
      var z = vector[2] || 0;

    var coords = coordsTransform(_pGlob.vec3Tmp.set(x, y, z), getCoordSystem(), 'Y_UP_RIGHT');

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName) continue;

        var obj = getObjectByName(objName);
        if (!obj) continue;

        if (!isPoint) {
            coords.normalize().add(obj.position);
        }

        if (lockUp) {
            // NOTE: partially copy-pasted from LockedTrackConstraint

            var targetWorldPos = new v3d.Vector3(coords.x, coords.y, coords.z);

            var lockDir = new v3d.Vector3(0, 1, 0);

            if (obj.isCamera || obj.isLight)
                var trackDir = new v3d.Vector3(0, 0, -1);
            else
                var trackDir = new v3d.Vector3(0, 0, 1);

            var projDir = new v3d.Vector3();
            var plane = _pGlob.planeTmp;

            var objWorldPos = new v3d.Vector3();
            objWorldPos.setFromMatrixPosition(obj.matrixWorld);

            plane.setFromNormalAndCoplanarPoint(lockDir, objWorldPos);
            plane.projectPoint(targetWorldPos, projDir).sub(objWorldPos);

            var sign = _pGlob.vec3Tmp2.crossVectors(trackDir, projDir).dot(lockDir) > 0 ? 1 : -1;

            obj.setRotationFromAxisAngle(plane.normal, sign * trackDir.angleTo(projDir));

            if (obj.parent) {
                obj.parent.matrixWorld.decompose(_pGlob.vec3Tmp2, _pGlob.quatTmp, _pGlob.vec3Tmp2);
                obj.quaternion.premultiply(_pGlob.quatTmp.invert());
            }

        } else {

            obj.lookAt(coords.x, coords.y, coords.z);

        }

        obj.updateMatrixWorld(true);
    }
}



registerOnClick('Cube.008', false, false, [0,1,2], function() {
  enterARMode('ORIGIN', true, function() {
    arHitTest(function() {
      setObjTransform('Scene', false, 'scale', [0.01, 0.01, 0.01], false);
      setCameraParam('FIELD_OF_VIEW', 'Camera', 70);
      setObjTransform('Scene', false, 'position', [arHitPoint('x'), arHitPoint('y'), arHitPoint('z')], false);
    }, function() {}, 0.7);
  }, function() {}, function() {});
}, function() {});

setObjDirection('Scene', [getObjTransform('Camera', false, 'position', 'x'), getObjTransform('Camera', false, 'position', 'y'), getObjTransform('Camera', false, 'position', 'z')], true, true);



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
