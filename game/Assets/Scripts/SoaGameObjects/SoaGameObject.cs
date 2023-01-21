using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoaGameObject : MonoBehaviour {
    
    void Start() {
        Debug.Log(this.GetType().Name + " started");
    }

    void Update() {
        
    }
    
    /*
     * Sets the name of this game object.
     */
    public void setName(string name) {
        this.name = name;
    }
    
    /*
     * Sets the material of this game object.
     */
    public void setMaterial(string material) {
        this.GetComponent<Renderer>().material = Resources.Load("Materials/" + material, typeof(Material)) as Material;
    }
    
    /*
     * Adds a mesh collider to this game object.
     */
    public void addMeshCollider() {
        this.gameObject.AddComponent<MeshCollider>();
    }
}
