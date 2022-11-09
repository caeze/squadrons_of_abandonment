using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RepublicCore : Building {
    
    void Start() {
        Debug.Log(this.GetType().Name + " component starting with parent game object " + gameObject);
        
        gameObject.transform.position += new Vector3(2, 0, 0);
        
        Debug.Log(this.GetType().Name + " started.");
    }

    void Update() {
        
    }
}
