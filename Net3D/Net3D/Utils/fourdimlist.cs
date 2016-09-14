using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Net3D.Utils
{
    public class fourdimlist<T> : List<List<List<List<T>>>> where T: new()
    {
        public void AddPos(T obj, int a, int b, int c, int d){
            for (int i = 0; i <= a + b + c + d + 4; i++ )
            {
                if (this.Count <= a)
                {
                    this.Add(new List<List<List<T>>>());
                    continue;
                }
                else if (this[a].Count <= b)
                {
                    this[a].Add(new List<List<T>>());
                    continue;
                }
                else if (this[a][b].Count <= c)
                {
                    this[a][b].Add(new List<T>());
                    continue;
                }
                else if (this[a][b][c].Count <= d)
                {
                    this[a][b][c].Add(new T());
                    continue;
                }
                else
                {
                    break;
                }
            }
            this[a][b][c][d] = obj;
        }
    }
}