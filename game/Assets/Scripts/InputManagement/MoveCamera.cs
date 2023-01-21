using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class MoveCamera : MonoBehaviour {
    
	private InputManager inputManager = new InputManager();
	private GameObject mainCameraParent = null;
	private GameObject mainCamera = null;
	private Vector3 mainCameraTargetPosition = new Vector3(0, 0, 0);
	private Quaternion mainCameraTargetRotation = Quaternion.Euler(45, 0, 0);
	private Vector3 mainCameraTargetZoom = new Vector3(0, 0, -10);
    private float cameraTranslationSpeed = 0.005f;
    private float cameraRotationSpeed = 0.25f;
    private float cameraZoomSpeed = 1.0f;
	private float cameraLerpSpeed = 20.0f;
    
    void Start() {
        mainCameraParent = GameObject.Find("MainCameraParent");
		mainCamera = GameObject.Find("MainCamera");
        mainCamera.transform.parent = mainCameraParent.transform;
        mainCamera.transform.position = mainCameraTargetZoom;
        Debug.Log(this.GetType().Name + " started");
    }
    
    void Update() {
        // camera view direction
        Vector3 cameraViewDirection = mainCameraParent.transform.forward.normalized;
        Vector3 cameraViewDirectionFlattened = Vector3.ProjectOnPlane(cameraViewDirection, Vector3.up).normalized;
        Vector3 cameraSidewaysDirectionFlattened = Quaternion.Euler(0, -90, 0) * cameraViewDirectionFlattened;
        
        // translate camera
        if (inputManager.keyHeldDown(InputManager.CAMERA_FORWARD)) {
            mainCameraTargetPosition += cameraViewDirectionFlattened * cameraTranslationSpeed * -mainCameraTargetZoom.z;
        }
        if (inputManager.keyHeldDown(InputManager.CAMERA_BACKWARD)) {
            mainCameraTargetPosition -= cameraViewDirectionFlattened * cameraTranslationSpeed * -mainCameraTargetZoom.z;
        }
        if (inputManager.keyHeldDown(InputManager.CAMERA_RIGHTWARD)) {
            mainCameraTargetPosition += cameraSidewaysDirectionFlattened * cameraTranslationSpeed * -mainCameraTargetZoom.z;
        }
        if (inputManager.keyHeldDown(InputManager.CAMERA_LEFTWARD)) {
            mainCameraTargetPosition -= cameraSidewaysDirectionFlattened * cameraTranslationSpeed * -mainCameraTargetZoom.z;
        }
        
        // rotate camera
        if (inputManager.keyPressedLastFrame(InputManager.CAMERA_ROTATE)) {
            inputManager.setLastMousePosToCurrentOne();
        }
        if (inputManager.keyHeldDown(InputManager.CAMERA_ROTATE)) {
            Vector3 mousePositionDelta = inputManager.getMousePositionDelta();
            Vector3 mainCameraTargetRotationEulerAngles = mainCameraTargetRotation.eulerAngles;
            mainCameraTargetRotationEulerAngles.x -= mousePositionDelta.y * cameraRotationSpeed;
            mainCameraTargetRotationEulerAngles.y += mousePositionDelta.x * cameraRotationSpeed;
            mainCameraTargetRotationEulerAngles.x = Math.Max(Math.Min(mainCameraTargetRotationEulerAngles.x, 89), 1);
            mainCameraTargetRotation = Quaternion.Euler(mainCameraTargetRotationEulerAngles);
        }
        
        // zoom camera
        mainCameraTargetZoom += new Vector3(0, 0, inputManager.getMouseScrollDelta() * cameraZoomSpeed);
        mainCameraTargetZoom.z = Math.Max(Math.Min(mainCameraTargetZoom.z, -1), -40);
        
        // interpolate the camera pose
        mainCameraParent.transform.position = Vector3.Lerp(mainCameraParent.transform.position, mainCameraTargetPosition, Time.deltaTime * cameraLerpSpeed);
		mainCameraParent.transform.rotation = Quaternion.Slerp(mainCameraParent.transform.rotation, mainCameraTargetRotation, Time.deltaTime * cameraLerpSpeed);
        mainCamera.transform.localPosition = Vector3.Lerp(mainCamera.transform.localPosition, mainCameraTargetZoom, Time.deltaTime * cameraLerpSpeed);
    }
}
