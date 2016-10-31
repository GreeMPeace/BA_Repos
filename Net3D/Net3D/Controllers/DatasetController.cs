using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Http;
using Net3D.Models;

namespace Net3D.Controllers
{
    public class DatasetController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Register([FromBody] Registration reg)
        {
            string [] dataset = reg.data;

            string contents;
            try
            {
                contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/registrations.txt"));
                var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
                for (int i = 0; i < lines.Length; i++)
                {
                    var data = lines[i].Split(new char[] { '\t' }, StringSplitOptions.RemoveEmptyEntries);
                    if (data[0] == dataset[0])
                        return new System.Web.Http.Results.BadRequestErrorMessageResult("The Name already exists.", this);
                }
            }
            catch
            { }

            try
            {
                System.IO.StreamWriter file = new System.IO.StreamWriter(HttpContext.Current.Server.MapPath(@"~/App_Data/registrations.txt"), true);
                for (int i = 0; i < dataset.Length; i++)
                {
                    file.Write(dataset[i] + "\t");
                }
                file.Write("\n");
                file.Close();
            }
            catch
            {
                return new System.Web.Http.Results.BadRequestErrorMessageResult("Something wrong with the File!", this);
            }

            return Ok(dataset[0]);
        }

        [HttpGet]
        public IHttpActionResult Get(string id)
        {
            string contents;
            Registration reg = new Registration();
            try
            {
                contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/registrations.txt"));
            }
            catch
            {
                return BadRequest("No Registrations!");
            }
            var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < lines.Length; i++)
            {
                var data = lines[i].Split(new char[] { '\t' }, StringSplitOptions.RemoveEmptyEntries);
                if (data[0] == id)
                    reg.data = data;
            }
            return Ok(reg);

        }

        [HttpGet]
        public IHttpActionResult GetAll()
        {
            string contents;
            try
            {
                contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/registrations.txt"));
            }
            catch
            {
                return BadRequest("No Registrations!");
            }
            var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            List<string> result = new List<string>();

            for (int i = 0; i < lines.Length; i++)
            {
                var data = lines[i].Split(new char[] { '\t' }, StringSplitOptions.RemoveEmptyEntries);
                result.Add(data[0]);
            }
            return Ok(result);
        }

        [HttpDelete]
        public IHttpActionResult Remove(string id)
        {
            var contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/registrations.txt"));
            var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            System.IO.File.Delete(HttpContext.Current.Server.MapPath(@"~/App_Data/registrations.txt"));
            var file = new System.IO.StreamWriter(HttpContext.Current.Server.MapPath(@"~/App_Data/registrations.txt"));
            bool found = false;
            for (int i = 0; i < lines.Length; i++)
            {
                var data = lines[i].Split(new char[] { '\t' }, StringSplitOptions.RemoveEmptyEntries);
                if (data[0] == id)
                {
                    found = true;
                    continue;
                }
                file.WriteLine(lines[i]);
            }
            file.Close();

            if (!found)
                return BadRequest("No such dataset!");

            return Ok(id);

        }
    }
}
