using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MouseClickManager : MonoBehaviour {
    
    private List<MouseClickListener> mouseClickListeners = new List<MouseClickListener>();
    private GameObject groundPlane;
    
    void Start() {
        Debug.Log(this.GetType().Name + " started");
        this.groundPlane = GameObject.Find("/GroundPlane");
    }

    void Update() {
        // register clicks on game objects
        if (Input.GetMouseButtonDown(0)) {
            // cast a ray into the scene and collect all mesh intersections
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit[] hits = Physics.RaycastAll(ray);
            
            // determine whether a game object or the ground plane was hit
            if (hits.Length == 1 && hits[0].collider.gameObject == this.groundPlane) {
                // only the ground plane was hit, so inform listeners
                Debug.Log("Only the ground plane was clicked, informing " + this.mouseClickListeners.Count + " listeners");
                foreach (MouseClickListener mouseClickListener in this.mouseClickListeners) {
                    mouseClickListener.groundPlaneClicked(hits[0].point);
                }
            } else if (hits.Length != 0) {
                // search for the first object that is not the ground plane
                RaycastHit hitWithSmallestDistance = hits[0];
                float currentSmallestDistance = float.PositiveInfinity;
                for (int i = 0; i < hits.Length; i++) {
                    if (hits[i].collider.gameObject != this.groundPlane) {
                        float distance = Vector3.Distance(hits[i].point, Camera.main.transform.position);
                        if (distance < currentSmallestDistance) {
                            hitWithSmallestDistance = hits[i];
                            currentSmallestDistance = distance;
                        }
                    }
                }
                Debug.Log("Raycast hit game object: " + hitWithSmallestDistance.collider.gameObject + ", informing listeners");
                foreach (MouseClickListener mouseClickListener in this.mouseClickListeners) {
                    mouseClickListener.gameObjectClicked(hitWithSmallestDistance.collider.gameObject, hitWithSmallestDistance.point);
                }
            }
        }
    }
    
    /*
     * Registers a mouse click listener.
     */
    public void registerMouseClickListener(MouseClickListener mouseClickListener) {
        this.mouseClickListeners.Add(mouseClickListener);
    }
    
    /*
     * Unregisters a mouse click listener.
     */
    public void unregisterMouseClickListener(MouseClickListener mouseClickListener) {
        this.mouseClickListeners.Remove(mouseClickListener);
    }
}
