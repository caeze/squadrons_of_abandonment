using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PrefabFactory : MonoBehaviour {
    
	void Start() {
        Debug.Log(this.GetType().Name + " component starting with parent game object " + name);
        Debug.Log(this.GetType().Name + " started.");
    }

    void Update() {
        
    }
    
    public T createBuildingFromPrefab<T>(string prefabPath) where T : Building {
        GameObject prefab = (GameObject) Instantiate(Resources.Load(prefabPath));
        T newComponent = prefab.AddComponent<T>();
        return newComponent;
    }
}

