using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RepublicCore : Building {
    
    void Start() {
        Debug.Log(this.GetType().Name + " started");
        base.setMaterial("red");
        base.addMeshCollider();
    }

    void Update() {
        
    }
}
